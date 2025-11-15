import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeBlobWithGemini } from "@/lib/gemini";

export function useGeminiRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const pickMimeType = () => {
    if (typeof MediaRecorder !== "undefined" && (MediaRecorder as any).isTypeSupported) {
      if ((MediaRecorder as any).isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
      if ((MediaRecorder as any).isTypeSupported("audio/webm")) return "audio/webm";
      if ((MediaRecorder as any).isTypeSupported("audio/mp4")) return "audio/mp4";
      if ((MediaRecorder as any).isTypeSupported("audio/mpeg")) return "audio/mpeg";
    }
    return undefined;
  };

  const start = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          chunksRef.current.push(ev.data);
        }
      };
      mr.onerror = () => {
        setError("Error en la grabación de audio");
      };
      mr.start();
      setIsRecording(true);
    } catch (e: any) {
      setError(e?.message || "No se pudo acceder al micrófono");
    }
  }, [isRecording]);

  const stopAndTranscribe = useCallback(async (): Promise<string | null> => {
    if (!isRecording || !mediaRecorderRef.current) return null;
    const mr = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;

    const buildBlob = () => {
      const mimeType = pickMimeType() || "audio/webm";
      return new Blob(chunksRef.current, { type: mimeType });
    };

    let resolveBlob: ((b: Blob) => void) | null = null;
    let timeoutId: number | null = null;
    const transcriptPromise = new Promise<Blob>((resolve) => {
      resolveBlob = resolve;
      mr.onstop = () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        resolve(buildBlob());
      };
      // Fallback: si onstop no llega, resolver con lo acumulado
      timeoutId = window.setTimeout(() => {
        resolve(buildBlob());
      }, 2000);
    });

    try {
      mr.stop();
    } catch {
      // Fallback inmediato si stop lanza: resolver con lo que haya
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      resolveBlob?.(buildBlob());
    }
    if (stream) {
      stream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // ignore
        }
      });
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    setIsRecording(false);

    const audioBlob = await transcriptPromise;
    setIsTranscribing(true);
    setError(null);
    try {
      const text = await transcribeBlobWithGemini(audioBlob, { mimeType: audioBlob.type });
      return text || "";
    } catch (e: any) {
      setError(e?.message || "Error transcribiendo audio");
      return null;
    } finally {
      setIsTranscribing(false);
      chunksRef.current = [];
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        // ignore
      }
      mediaStreamRef.current?.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  return {
    isRecording,
    isTranscribing,
    error,
    start,
    stopAndTranscribe,
  };
}



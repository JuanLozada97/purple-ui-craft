import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeBlobWithGemini } from "@/lib/gemini";

type UseGeminiLiveChunksOptions = {
  timesliceMs?: number;
  onPartial?: (text: string) => void;
  onError?: (error: string) => void;
};

export function useGeminiLiveChunks(options: UseGeminiLiveChunksOptions = {}) {
  const { timesliceMs = 2000, onPartial, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pendingBlobsRef = useRef<Blob[]>([]);
  const processingRef = useRef(false);
  const cancelledRef = useRef(false);

  const pickMimeType = () => {
    if (typeof MediaRecorder !== "undefined" && (MediaRecorder as any).isTypeSupported) {
      if ((MediaRecorder as any).isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
      if ((MediaRecorder as any).isTypeSupported("audio/webm")) return "audio/webm";
      if ((MediaRecorder as any).isTypeSupported("audio/mp4")) return "audio/mp4";
      if ((MediaRecorder as any).isTypeSupported("audio/mpeg")) return "audio/mpeg";
    }
    return undefined;
  };

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    try {
      // Procesa en orden FIFO para mantener la secuencia de fragmentos
      while (!cancelledRef.current && pendingBlobsRef.current.length > 0) {
        const blob = pendingBlobsRef.current.shift()!;
        if (!blob || blob.size === 0) continue;
        try {
          const text = await transcribeBlobWithGemini(blob, { mimeType: blob.type });
          if (text) onPartial?.(text);
        } catch (e: any) {
          onError?.(e?.message || "Error transcribiendo fragmento");
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, [onPartial, onError]);

  const start = useCallback(async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (ev: BlobEvent) => {
        const blob = ev.data;
        if (!blob || blob.size === 0) return;
        pendingBlobsRef.current.push(blob);
        // Dispara el procesado secuencial si no está corriendo
        void processQueue();
      };

      mr.onerror = () => {
        onError?.("Error en la grabación de audio");
      };

      mr.start(timesliceMs);
      cancelledRef.current = false;
      setIsRecording(true);
    } catch (e: any) {
      onError?.(e?.message || "No se pudo acceder al micrófono");
    }
  }, [isRecording, onError, processQueue, timesliceMs]);

  const stop = useCallback(() => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      // ignore
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // ignore
        }
      });
    }
    mediaStreamRef.current = null;
    cancelledRef.current = true;
    pendingBlobsRef.current = [];
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
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
      cancelledRef.current = true;
      pendingBlobsRef.current = [];
    };
  }, []);

  return {
    isRecording,
    start,
    stop,
  };
}



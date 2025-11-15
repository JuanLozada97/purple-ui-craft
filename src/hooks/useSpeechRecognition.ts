import { useCallback, useEffect, useRef, useState } from "react";

type UseSpeechRecognitionOptions = {
  lang?: string;
  onFinalResult?: (text: string) => void;
  /**
   * Reintenta automáticamente cuando el reconocimiento termina por causas externas.
   * Útil en móviles donde `continuous` no siempre se respeta.
   */
  autoRestart?: boolean;
};

/**
 * Hook para manejar Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * centrado en resultados finales y control simple de inicio/parada.
 */
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang, onFinalResult, autoRestart = true } = options;

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolución de clase SpeechRecognition (estándar o prefijo webkit)
  const SpeechRecognitionClassRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const manuallyStoppedRef = useRef(false);

  const isSupported =
    typeof window !== "undefined" &&
    (("SpeechRecognition" in window) || ("webkitSpeechRecognition" in (window as any)));

  // Inicializa instancia
  useEffect(() => {
    if (!isSupported) return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    SpeechRecognitionClassRef.current = SR;

    const recognition = new SR();
    recognition.lang = lang || navigator.language || "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onerror = (e: any) => {
      // Errores comunes: "no-speech", "audio-capture", "not-allowed"
      setError(e?.error ?? "speech-error");
    };

    recognition.onresult = (event: any) => {
      // Añadimos solo resultados finales
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res && res.isFinal) {
          const transcript = (res[0]?.transcript ?? "").trim();
          if (transcript) {
            onFinalResult?.(transcript);
          }
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!manuallyStoppedRef.current && autoRestart) {
        try {
          recognition.start();
        } catch {
          // Evitar crash si el navegador bloquea reinicio inmediato
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, lang, autoRestart]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError("unsupported");
      return;
    }
    if (!recognitionRef.current) return;
    manuallyStoppedRef.current = false;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch {
      // Algunos navegadores lanzan si ya está iniciado
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    manuallyStoppedRef.current = true;
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    isSupported,
    isListening,
    error,
    start,
    stop,
    toggle,
  };
}



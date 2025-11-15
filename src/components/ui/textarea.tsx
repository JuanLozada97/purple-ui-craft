import * as React from "react";

import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { appendToActiveTextarea } from "@/lib/appendToActiveTextarea";
import { useToast } from "@/components/ui/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const { toast } = useToast();

  const { isSupported, isListening, error, toggle, start } = useSpeechRecognition({
    lang: "es-ES",
    onFinalResult: (text) => {
      // Añade un espacio al final para separación natural entre frases
      const ok = appendToActiveTextarea(text + " ");
      if (!ok) {
        toast({
          title: "No hay un campo activo",
          description: "Haz clic dentro del área de texto antes de dictar.",
          variant: "destructive",
        });
      }
    },
  });

  React.useEffect(() => {
    if (error && error !== "unsupported") {
      toast({
        title: "Error de dictado",
        description: `Ocurrió un error: ${error}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const assignRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    }
  };

  const onClickMic = () => {
    if (props.disabled) return;
    if (!isSupported) {
      toast({
        title: "Dictado no soportado",
        description: "Tu navegador no soporta reconocimiento de voz.",
        variant: "destructive",
      });
      return;
    }
    // Asegura que este textarea reciba el dictado
    innerRef.current?.focus();
    // Si no estaba escuchando, iniciar explícitamente antes del toggle para evitar errores de arranque
    if (!isListening) {
      start();
    } else {
      toggle();
    }
  };

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={assignRef}
        {...props}
      />

      {/* Botón de micrófono overlay */}
      <button
        type="button"
        aria-label={isListening ? "Detener dictado" : "Iniciar dictado"}
        aria-pressed={isListening}
        onClick={onClickMic}
        disabled={props.disabled}
        className={cn(
          "absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isListening && "bg-primary text-primary-foreground hover:bg-primary/90",
          props.disabled && "opacity-50 cursor-not-allowed",
        )}
        title={isSupported ? (isListening ? "Escuchando..." : "Dictado por voz") : "Dictado no soportado"}
      >
        <Mic className="h-4 w-4" />
      </button>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

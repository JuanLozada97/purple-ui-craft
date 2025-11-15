import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Procedure } from "./SurgicalIntervention";
import { cn } from "@/lib/utils";
import ValidationAlerts from "./ValidationAlerts";
import { ValidationResponse } from "@/types/validation";
import { surgicalDescriptionSchema, type SurgicalDescriptionFormData } from "@/schemas/surgical";
import { sanitizeMedicalText } from "@/lib/sanitize";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

interface SurgicalDescriptionProps {
  onNext?: () => void;
  hallazgos: string;
  setHallazgos: (value: string) => void;
  detalleQuirurgico: string;
  setDetalleQuirurgico: (value: string) => void;
  complicaciones: string;
  setComplicaciones: (value: string) => void;
  scheduledProcedures: Procedure[];
}

const SurgicalDescription = ({
  onNext,
  hallazgos,
  setHallazgos,
  detalleQuirurgico,
  setDetalleQuirurgico,
  complicaciones,
  setComplicaciones,
  scheduledProcedures,
}: SurgicalDescriptionProps) => {
  const [isSending, setIsSending] = useState(false);
  const [validationData, setValidationData] = useState<ValidationResponse | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [canProceed, setCanProceed] = useState(true);

  // Initialize form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SurgicalDescriptionFormData>({
    resolver: zodResolver(surgicalDescriptionSchema),
    defaultValues: {
      hallazgos,
      detalleQuirurgico,
      complicaciones,
    },
  });

  // Sync form values with parent state
  useEffect(() => {
    setValue("hallazgos", hallazgos);
    setValue("detalleQuirurgico", detalleQuirurgico);
    setValue("complicaciones", complicaciones);
  }, [hallazgos, detalleQuirurgico, complicaciones, setValue]);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setCanProceed(true);
    }
  }, [countdown]);

  // Helper function to check if a field has alerts
  const hasAlert = (fieldName: string): boolean => {
    if (!validationData?.alertas) return false;
    return validationData.alertas.some((alert) => alert.campo === fieldName);
  };

  const handleNext = async (data: SurgicalDescriptionFormData) => {
    setIsSending(true);
    setValidationData(null); // Clear previous alerts

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_VALIDATION_URL;

      if (!webhookUrl) {
        throw new Error("La configuración del webhook de validación no está disponible");
      }

      // Sanitize inputs before sending
      const sanitizedData = {
        hallazgos: sanitizeMedicalText(data.hallazgos),
        "Detalle quirurgico": sanitizeMedicalText(data.detalleQuirurgico),
        complicaciones: sanitizeMedicalText(data.complicaciones),
        procedimientos_programados: scheduledProcedures.map((proc) => ({
          codigo: proc.code,
          descripcion: proc.name,
          via: proc.via,
        })),
      };

      const response = await fetchWithTimeout(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos al webhook");
      }

      // Process validation response
      const validationResult: ValidationResponse = await response.json();

      if (validationResult.tiene_alertas) {
        // Siempre mostrar las alertas
        setValidationData(validationResult);
        
        if (validationResult.nivel_gravedad_global === "alta") {
          // GRAVEDAD ALTA: Bloquear navegación por 5 segundos
          setCanProceed(false);
          setCountdown(5);
          toast.warning(
            `⚠️ Se encontraron ${validationResult.alertas.length} problema(s) de gravedad ALTA. Debes revisar antes de continuar.`,
            { duration: 5000 }
          );
        } else {
          // GRAVEDAD MEDIA/BAJA: Mostrar advertencia pero permitir continuar
          toast.info(
            `ℹ️ Se encontraron ${validationResult.alertas.length} recomendación(es) de gravedad ${validationResult.nivel_gravedad_global.toUpperCase()}. Puedes revisar y continuar.`,
            { duration: 4000 }
          );
          
          // Permitir continuar inmediatamente
          if (onNext) {
            onNext();
          }
        }
      } else {
        // No alerts: proceed normally
        toast.success("✅ Datos validados y enviados exitosamente");

        if (onNext) {
          onNext();
        }
      }
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("❌ Error al enviar los datos. Por favor, intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-accent">
        <CardTitle className="text-primary flex items-center gap-2">
          <span>📝</span>
          Descripción quirúrgica
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Show validation alerts if they exist */}
        {validationData?.tiene_alertas && (
          <ValidationAlerts
            validationData={validationData}
            onDismiss={() => {
              setValidationData(null);
              setCanProceed(true);
              setCountdown(null);
            }}
          />
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="findings"
              className={cn(
                "text-base font-semibold text-medical-blue",
                (hasAlert("hallazgos") || errors.hallazgos) && "text-destructive"
              )}
            >
              Hallazgo operatorio
              {(hasAlert("hallazgos") || errors.hallazgos) && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="findings"
              {...register("hallazgos", {
                onChange: (e) => setHallazgos(e.target.value),
              })}
              placeholder="Describa los hallazgos operatorios..."
              className={cn(
                "min-h-[200px] resize-y",
                (hasAlert("hallazgos") || errors.hallazgos) && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
            {errors.hallazgos && (
              <p className="text-sm text-destructive">{errors.hallazgos.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="details"
              className={cn(
                "text-base font-semibold text-medical-blue",
                (hasAlert("Detalle quirurgico") || errors.detalleQuirurgico) && "text-destructive",
              )}
            >
              Detalle quirúrgico - procedimientos
              {(hasAlert("Detalle quirurgico") || errors.detalleQuirurgico) && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="details"
              {...register("detalleQuirurgico", {
                onChange: (e) => setDetalleQuirurgico(e.target.value),
              })}
              placeholder="Describa el detalle quirúrgico..."
              className={cn(
                "min-h-[200px] resize-y",
                (hasAlert("Detalle quirurgico") || errors.detalleQuirurgico) && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
            {errors.detalleQuirurgico && (
              <p className="text-sm text-destructive">{errors.detalleQuirurgico.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="complications"
              className={cn(
                "text-base font-semibold text-medical-blue",
                (hasAlert("complicaciones") || errors.complicaciones) && "text-destructive",
              )}
            >
              Complicaciones
              {(hasAlert("complicaciones") || errors.complicaciones) && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="complications"
              {...register("complicaciones", {
                onChange: (e) => setComplicaciones(e.target.value),
              })}
              placeholder="Describa las complicaciones si las hubo..."
              className={cn(
                "min-h-[200px] resize-y",
                (hasAlert("complicaciones") || errors.complicaciones) && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
            {errors.complicaciones && (
              <p className="text-sm text-destructive">{errors.complicaciones.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">← Atrás</Button>
          <Button
            onClick={handleSubmit(handleNext)}
            disabled={isSending || !canProceed || countdown !== null}
            className={cn(countdown !== null && "opacity-50 cursor-not-allowed")}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Validando...
              </>
            ) : countdown !== null ? (
              <>🔒 Espera {countdown}s para continuar</>
            ) : (
              "Siguiente →"
            )}
          </Button>
          <Button variant="outline">Salir</Button>
          <Button variant="secondary">Ayuda</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurgicalDescription;

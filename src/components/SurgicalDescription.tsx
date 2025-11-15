import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Procedure } from "./SurgicalIntervention";
import { cn } from "@/lib/utils";
import ValidationAlerts from "./ValidationAlerts";
import { ValidationResponse } from "@/types/validation";

interface SurgicalDescriptionProps {
  onNext?: () => void;
  hallazgos: string;
  setHallazgos: (value: string) => void;
  detalleQuirurgico: string;
  setDetalleQuirurgico: (value: string) => void;
  complicaciones: string;
  setComplicaciones: (value: string) => void;
  suggestedProcedures: Procedure[];
  scheduledProcedures: Procedure[];
  performedProcedures: Procedure[];
}

const SurgicalDescription = ({
  onNext,
  hallazgos,
  setHallazgos,
  detalleQuirurgico,
  setDetalleQuirurgico,
  complicaciones,
  setComplicaciones,
  suggestedProcedures,
  scheduledProcedures,
  performedProcedures,
}: SurgicalDescriptionProps) => {
  const [isSending, setIsSending] = useState(false);
  const [validationData, setValidationData] = useState<ValidationResponse | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [canProceed, setCanProceed] = useState(true);

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

  const handleNext = async () => {
    setIsSending(true);
    setValidationData(null); // Clear previous alerts

    try {
      const webhookUrl = "https://n8n.bohorquez.cc/webhook/d595b1e7-d764-463a-8bad-0f0f6c3a5a24";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hallazgos,
          "Detalle quirurgico": detalleQuirurgico,
          complicaciones,
          procedimientos_sugeridos: suggestedProcedures.map((proc) => ({
            codigo: proc.code,
            descripcion: proc.name,
            via: proc.via,
            razon: proc.reason || "",
          })),
          procedimientos_programados: scheduledProcedures.map((proc) => ({
            codigo: proc.code,
            descripcion: proc.name,
            via: proc.via,
          })),
          procedimientos_realizados: performedProcedures.map((proc) => ({
            codigo: proc.code,
            descripcion: proc.name,
            via: proc.via,
            cantidad: proc.quantity || 1,
            es_principal: proc.isPrimary || false,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos al webhook");
      }

      // Process validation response
      const validationResult: ValidationResponse = await response.json();

      if (validationResult.tiene_alertas) {
        // Show alerts and block navigation
        setValidationData(validationResult);
        setCanProceed(false);
        setCountdown(5);

        toast.warning(`⚠️ Se encontraron ${validationResult.alertas.length} problema(s). Revisa las alertas.`, {
          duration: 4000,
        });
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
              className={cn("text-base font-semibold text-medical-blue", hasAlert("hallazgos") && "text-destructive")}
            >
              Hallazgo operatorio
              {hasAlert("hallazgos") && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="findings"
              value={hallazgos}
              onChange={(e) => setHallazgos(e.target.value)}
              placeholder="Describa los hallazgos operatorios..."
              className={cn(
                "min-h-[200px] resize-y",
                hasAlert("hallazgos") && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="details"
              className={cn(
                "text-base font-semibold text-medical-blue",
                hasAlert("Detalle quirurgico") && "text-destructive",
              )}
            >
              Detalle quirúrgico - procedimientos
              {hasAlert("Detalle quirurgico") && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="details"
              value={detalleQuirurgico}
              onChange={(e) => setDetalleQuirurgico(e.target.value)}
              placeholder="Describa el detalle quirúrgico..."
              className={cn(
                "min-h-[200px] resize-y",
                hasAlert("Detalle quirurgico") && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="complications"
              className={cn(
                "text-base font-semibold text-medical-blue",
                hasAlert("complicaciones") && "text-destructive",
              )}
            >
              Complicaciones
              {hasAlert("complicaciones") && <span className="ml-2">⚠️</span>}
            </Label>
            <Textarea
              id="complications"
              value={complicaciones}
              onChange={(e) => setComplicaciones(e.target.value)}
              placeholder="Describa las complicaciones si las hubo..."
              className={cn(
                "min-h-[200px] resize-y",
                hasAlert("complicaciones") && "border-destructive border-2 focus-visible:ring-destructive",
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">← Atrás</Button>
          <Button
            onClick={handleNext}
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

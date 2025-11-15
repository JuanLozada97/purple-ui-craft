import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SurgicalDescriptionProps {
  onNext?: () => void;
}

const SurgicalDescription = ({ onNext }: SurgicalDescriptionProps) => {
  const [hallazgos, setHallazgos] = useState("");
  const [detalleQuirurgico, setDetalleQuirurgico] = useState("");
  const [complicaciones, setComplicaciones] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleNext = async () => {
    setIsSending(true);

    try {
      const webhookUrl = "https://n8n.bohorquez.cc/webhook-test/7fe060e2-01c5-404b-b7de-d6e5dc421d7a";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hallazgos,
          "Detalle quirurgico": detalleQuirurgico,
          complicaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos al webhook");
      }

      toast.success("✅ Datos enviados exitosamente");

      // Call onNext after successful submission
      if (onNext) {
        onNext();
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="findings" className="text-base font-semibold text-medical-blue">
              Hallazgo operatorio
            </Label>
            <Textarea
              id="findings"
              value={hallazgos}
              onChange={(e) => setHallazgos(e.target.value)}
              placeholder="ZXCZXCZXC"
              className="min-h-[200px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-base font-semibold text-medical-blue">
              Detalle quirúrgico - procedimientos
            </Label>
            <Textarea
              id="details"
              value={detalleQuirurgico}
              onChange={(e) => setDetalleQuirurgico(e.target.value)}
              placeholder="ZXCZXCZX"
              className="min-h-[200px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complications" className="text-base font-semibold text-medical-blue">
              Complicaciones
            </Label>
            <Textarea
              id="complications"
              value={complicaciones}
              onChange={(e) => setComplicaciones(e.target.value)}
              placeholder="ZXCZXCZXC"
              className="min-h-[200px] resize-y"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">← Atrás</Button>
          <Button onClick={handleNext} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SurgicalDescriptionProps {
  onNext?: () => void;
}

const SurgicalDescription = ({ onNext }: SurgicalDescriptionProps) => {
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
              placeholder="ZXCZXCZXC"
              className="min-h-[200px] resize-y"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">← Atrás</Button>
          <Button onClick={onNext}>Siguiente →</Button>
          <Button variant="outline">Salir</Button>
          <Button variant="secondary">Ayuda</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurgicalDescription;

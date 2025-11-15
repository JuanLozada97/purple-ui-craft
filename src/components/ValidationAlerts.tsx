import { AlertCircle, AlertTriangle, Info, HelpCircle, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ValidationResponse } from "@/types/validation";

interface ValidationAlertsProps {
  validationData: ValidationResponse;
  onDismiss: () => void;
}

const ValidationAlerts = ({ validationData, onDismiss }: ValidationAlertsProps) => {
  const { alertas, nivel_gravedad_global } = validationData;

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "dato_faltante":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "dato_incompleto":
        return <Info className="h-4 w-4 text-primary" />;
      case "dato_confuso":
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
      case "inconsistencia":
        return <Zap className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getImpactVariant = (impacto: string): "default" | "secondary" | "destructive" => {
    switch (impacto) {
      case "alto":
        return "destructive";
      case "medio":
        return "default";
      case "bajo":
        return "secondary";
      default:
        return "default";
    }
  };

  const getGravedadVariant = (gravedad: string): "default" | "secondary" | "destructive" => {
    switch (gravedad) {
      case "alta":
        return "destructive";
      case "media":
        return "default";
      case "baja":
        return "secondary";
      default:
        return "default";
    }
  };

  const getAlertVariant = (gravedad: string): "default" | "destructive" => {
    return gravedad === "alta" ? "destructive" : "default";
  };

  return (
    <div className="space-y-4 mb-6 animate-in fade-in-50 slide-in-from-top-2">
      <Alert variant={getAlertVariant(nivel_gravedad_global)}>
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold flex items-center gap-2 flex-wrap">
          {nivel_gravedad_global === "alta" ? "⚠️" : "ℹ️"} Se encontraron {alertas.length} problema(s) en la descripción
          <Badge variant={getGravedadVariant(nivel_gravedad_global)}>
            Gravedad: {nivel_gravedad_global}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          {nivel_gravedad_global === "alta" 
            ? "Debes corregir estos puntos antes de continuar (5 segundos de espera)."
            : "Revisa estas recomendaciones. Puedes continuar si lo deseas."
          }
        </AlertDescription>
      </Alert>

      <Accordion type="multiple" className="w-full">
        {alertas.map((alerta, index) => (
          <AccordionItem key={index} value={`alert-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 w-full">
                {getAlertIcon(alerta.tipo)}
                <span className="font-semibold flex-1 text-left">
                  Campo: {alerta.campo}
                </span>
                <Badge variant={getImpactVariant(alerta.impacto)}>
                  {alerta.impacto}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-semibold text-foreground">
                    {alerta.descripcion_alerta}
                  </p>
                </div>
                
                {alerta.preguntas_guia.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-muted-foreground">
                      💡 Preguntas guía para mejorar:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      {alerta.preguntas_guia.map((pregunta, i) => (
                        <li key={i} className="text-sm text-foreground/90">
                          {pregunta}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        onClick={onDismiss}
        variant="outline"
        className="w-full"
      >
        Entendido, voy a corregir
      </Button>
    </div>
  );
};

export default ValidationAlerts;

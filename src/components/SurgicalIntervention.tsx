import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Sparkles, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { aiSuggestionRequestSchema, procedureSchema } from "@/schemas/surgical";
import { sanitizeForAIPrompt } from "@/lib/sanitize";
export interface Procedure {
  code: string;
  name: string;
  via: string;
  reason?: string;
  quantity?: number;
  isPrimary?: boolean;
}
interface SurgicalInterventionProps {
  suggestedProcedures: Procedure[];
  setSuggestedProcedures: (value: Procedure[]) => void;
  scheduledProcedures: Procedure[];
  setScheduledProcedures: (value: Procedure[]) => void;
  performedProcedures: Procedure[];
  setPerformedProcedures: (value: Procedure[]) => void;
  hallazgos: string;
  detalleQuirurgico: string;
  complicaciones: string;
}
const SurgicalIntervention = ({
  suggestedProcedures,
  setSuggestedProcedures,
  scheduledProcedures,
  setScheduledProcedures,
  performedProcedures,
  setPerformedProcedures,
  hallazgos,
  detalleQuirurgico,
  complicaciones
}: SurgicalInterventionProps) => {
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const generateSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      // Sanitize inputs before sending to webhook
      const sanitizedPayload = {
        hallazgos: sanitizeForAIPrompt(hallazgos, 500),
        "Detalle quirurgico": sanitizeForAIPrompt(detalleQuirurgico, 500),
        complicaciones: sanitizeForAIPrompt(complicaciones, 500),
        procedimientos_programados: scheduledProcedures.map((proc) => ({
          codigo: proc.code,
          descripcion: proc.name,
          via: proc.via,
        })),
      };

      const response = await fetch("https://n8n.bohorquez.cc/webhook/7fe060e2-01c5-404b-b7de-d6e5dc421d7a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedPayload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mapear la respuesta del webhook al formato esperado
      const suggestions = data.procedimientos_sugeridos?.map((proc: any) => ({
        code: proc.codigo,
        name: proc.descripcion,
        via: proc.via,
      })) || [];

      setSuggestedProcedures(suggestions);
      toast.success(`✅ ${suggestions.length} sugerencias generadas exitosamente`);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("❌ Error al generar sugerencias. Por favor, intenta de nuevo.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  const addToScheduled = (procedure: Procedure) => {
    // Validate procedure data
    const validationResult = procedureSchema.safeParse(procedure);

  if (!validationResult.success) {
    toast.error("El procedimiento tiene datos inválidos");
    console.error("Validation errors:", validationResult.error.errors);
    return;
  }

  setScheduledProcedures([...scheduledProcedures, validationResult.data as Procedure]);
  toast.success("✅ Procedimiento agregado a programados");
  };

  const addToPerformed = (procedure: Procedure) => {
    const newProcedure = {
      ...procedure,
      quantity: 1,
      isPrimary: performedProcedures.length === 0
    };

    // Validate procedure data
    const validationResult = procedureSchema.safeParse(newProcedure);

  if (!validationResult.success) {
    toast.error("El procedimiento tiene datos inválidos");
    console.error("Validation errors:", validationResult.error.errors);
    return;
  }

  setPerformedProcedures([...performedProcedures, validationResult.data as Procedure]);
  toast.success("✅ Procedimiento agregado a realizados");
  };
  const removeFromScheduled = (index: number) => {
    setScheduledProcedures(scheduledProcedures.filter((_, i) => i !== index));
  };
  const removeFromPerformed = (index: number) => {
    setPerformedProcedures(performedProcedures.filter((_, i) => i !== index));
  };
  return <Card>
      <CardHeader className="bg-accent">
        <CardTitle className="text-primary flex items-center gap-2">
          <span>🔄</span>
          Intervención practicada
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* General Section */}
        

        {/* Additional Information */}
        

        {/* IPS Services */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Servicios IPS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Procedimientos</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Buscar procedimiento..." className="flex-1" />
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Suggested Procedures Section */}
            <div className="bg-gradient-to-r from-primary/5 to-accent p-4 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Procedimientos Sugeridos por IA
                </h4>
                <Button onClick={generateSuggestions} disabled={isLoadingSuggestions} size="sm" className="gap-2">
                  {isLoadingSuggestions ? <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando...
                    </> : <>
                      <Sparkles className="h-4 w-4" />
                      Generar Sugerencias con IA
                    </>}
                </Button>
              </div>

              {isLoadingSuggestions ? <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div> : suggestedProcedures.length > 0 ? <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Procedimiento sugerido</TableHead>
                      <TableHead>Vía</TableHead>
                      <TableHead>Razón</TableHead>
                      <TableHead className="w-[100px]">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestedProcedures.map((procedure, index) => <TableRow key={index} className="bg-background">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {procedure.reason}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => addToScheduled(procedure)}>
                            Agregar <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table> : <p className="text-center text-muted-foreground py-8">
                  Haz clic en el botón para generar sugerencias de procedimientos basadas en el
                  diagnóstico del paciente
                </p>}
            </div>

            {/* Scheduled Procedures */}
            <div>
              <h4 className="font-semibold text-base mb-3">Procedimientos Programados</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead className="w-[150px]">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledProcedures.length > 0 ? scheduledProcedures.map((procedure, index) => <TableRow key={index} className="bg-accent">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => addToPerformed(procedure)}>
                              Realizar <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => removeFromScheduled(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>) : <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No hay procedimientos programados
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>

            {/* Performed Procedures */}
            <div>
              <h4 className="font-semibold text-base mb-3">Procedimientos Realizados</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Procedimiento</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead className="w-[100px]">Cantidad</TableHead>
                    <TableHead className="w-[100px]">Principal</TableHead>
                    <TableHead className="w-[80px]">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performedProcedures.length > 0 ? performedProcedures.map((procedure, index) => <TableRow key={index} className="bg-primary/5">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell>{procedure.quantity}</TableCell>
                        <TableCell className="text-center">
                          {procedure.isPrimary ? "✓" : ""}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => removeFromPerformed(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>) : <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No hay procedimientos realizados
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Diagnostics */}
        

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Otras opciones</Button>
          <Button variant="outline">← Atrás</Button>
          <Button>Siguiente →</Button>
          <Button variant="outline">Salir</Button>
          <Button variant="secondary">Ayuda</Button>
        </div>
      </CardContent>
    </Card>;
};
export default SurgicalIntervention;
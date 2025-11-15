import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Sparkles, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Procedure {
  code: string;
  name: string;
  via: string;
  reason?: string;
  quantity?: number;
  isPrimary?: boolean;
}

const SurgicalIntervention = () => {
  const [suggestedProcedures, setSuggestedProcedures] = useState<Procedure[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [scheduledProcedures, setScheduledProcedures] = useState<Procedure[]>([
    {
      code: "471102",
      name: "471102 - APENDICECTOMIA VIA ABIERTA",
      via: "BILATERAL MULTIPLE",
    },
  ]);
  const [performedProcedures, setPerformedProcedures] = useState<Procedure[]>([]);

  const generateSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-procedures", {
        body: {
          diagnosis: "A013 - FIEBRE PARATIFOIDEA C",
          surgeryType: "Cirugía urgente",
          patientInfo: "Paciente con anestesia regional, clasificación ASA II",
        },
      });

      if (error) {
        console.error("Error invoking function:", error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuggestedProcedures(data.suggestions || []);
      toast.success("✅ Sugerencias generadas exitosamente");
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("❌ Error al generar sugerencias. Por favor, intenta de nuevo.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addToScheduled = (procedure: Procedure) => {
    setScheduledProcedures([...scheduledProcedures, procedure]);
    toast.success("✅ Procedimiento agregado a programados");
  };

  const addToPerformed = (procedure: Procedure) => {
    const newProcedure = {
      ...procedure,
      quantity: 1,
      isPrimary: performedProcedures.length === 0,
    };
    setPerformedProcedures([...performedProcedures, newProcedure]);
    toast.success("✅ Procedimiento agregado a realizados");
  };

  const removeFromScheduled = (index: number) => {
    setScheduledProcedures(scheduledProcedures.filter((_, i) => i !== index));
  };

  const removeFromPerformed = (index: number) => {
    setPerformedProcedures(performedProcedures.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="bg-accent">
        <CardTitle className="text-primary flex items-center gap-2">
          <span>🔄</span>
          Intervención practicada
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* General Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">General</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="room">No. Sala</Label>
              <Input id="room" defaultValue="234" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="startDate">Fecha hora de inicio</Label>
              <Input id="startDate" type="datetime-local" defaultValue="2025-11-15T09:30" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="anesthesiaType">Tipo de anestesia</Label>
              <Select defaultValue="regional">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="classification">Clasificación ASA</Label>
              <Select defaultValue="2">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ASA I</SelectItem>
                  <SelectItem value="2">ASA II</SelectItem>
                  <SelectItem value="3">ASA III</SelectItem>
                  <SelectItem value="4">ASA IV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endDate">Fecha hora final</Label>
              <Input id="endDate" type="datetime-local" defaultValue="2025-11-15T10:00" className="mt-1" />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox id="urgentSurgery" defaultChecked />
              <Label htmlFor="urgentSurgery" className="text-sm font-normal">
                Cirugía urgente
              </Label>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Información adicional</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="prosthesis" />
              <Label htmlFor="prosthesis" className="text-sm font-normal">
                Prótesis / implantes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hip" />
              <Label htmlFor="hip" className="text-sm font-normal">
                Cx cadera
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="knee" />
              <Label htmlFor="knee" className="text-sm font-normal">
                Cx rodilla
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="laparotomy" />
              <Label htmlFor="laparotomy" className="text-sm font-normal">
                Laparotomía
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="openFracture" />
              <Label htmlFor="openFracture" className="text-sm font-normal">
                Fractura abierta
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="classification" />
              <Label htmlFor="classification" className="text-sm font-normal">
                Clasificación
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="antibiotics" defaultChecked />
              <Label htmlFor="antibiotics" className="text-sm font-normal">
                Profilaxis con antimicrobianos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="contamination" defaultChecked />
              <Label htmlFor="contamination" className="text-sm font-normal">
                Herida cerrada sin contaminación
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="woundType">Tipo de heridas</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">Limpia</SelectItem>
                  <SelectItem value="contaminated">Contaminada</SelectItem>
                  <SelectItem value="infected">Infectada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adminTime">Hora administración</Label>
              <Input id="adminTime" type="time" defaultValue="12:00" className="mt-1" />
            </div>
          </div>
        </div>

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
                <Button
                  onClick={generateSuggestions}
                  disabled={isLoadingSuggestions}
                  size="sm"
                  className="gap-2"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generar Sugerencias con IA
                    </>
                  )}
                </Button>
              </div>

              {isLoadingSuggestions ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : suggestedProcedures.length > 0 ? (
                <Table>
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
                    {suggestedProcedures.map((procedure, index) => (
                      <TableRow key={index} className="bg-background">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {procedure.reason}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToScheduled(procedure)}
                          >
                            Agregar <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Haz clic en el botón para generar sugerencias de procedimientos basadas en el
                  diagnóstico del paciente
                </p>
              )}
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
                  {scheduledProcedures.length > 0 ? (
                    scheduledProcedures.map((procedure, index) => (
                      <TableRow key={index} className="bg-accent">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToPerformed(procedure)}
                            >
                              Realizar <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromScheduled(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No hay procedimientos programados
                      </TableCell>
                    </TableRow>
                  )}
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
                  {performedProcedures.length > 0 ? (
                    performedProcedures.map((procedure, index) => (
                      <TableRow key={index} className="bg-primary/5">
                        <TableCell className="font-medium">{procedure.code}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell>{procedure.via}</TableCell>
                        <TableCell>{procedure.quantity}</TableCell>
                        <TableCell className="text-center">
                          {procedure.isPrimary ? "✓" : ""}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromPerformed(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No hay procedimientos realizados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Diagnostics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Diagnósticos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pre-Operatorio</Label>
              <Select defaultValue="a013">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a013">A013 - FIEBRE PARATIFOIDEA C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Post-Operatorio</Label>
              <Select defaultValue="a013">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a013">A013 - FIEBRE PARATIFOIDEA C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Otras opciones</Button>
          <Button variant="outline">← Atrás</Button>
          <Button>Siguiente →</Button>
          <Button variant="outline">Salir</Button>
          <Button variant="secondary">Ayuda</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurgicalIntervention;

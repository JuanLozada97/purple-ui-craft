import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Sparkles, Loader2, Trash2, Search, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { aiSuggestionRequestSchema, procedureSchema } from "@/schemas/surgical";
import { sanitizeForAIPrompt } from "@/lib/sanitize";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import {
  PROCEDURES_LIST,
  PROCEDURE_CATEGORIES,
  searchProcedures,
  getProceduresByCategory,
  type ProcedureTemplate
} from "@/data/procedures";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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

  // Procedure selector state
  const [open, setOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const generateSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_SUGGESTIONS_URL;

      if (!webhookUrl) {
        toast.error("La configuración del webhook de sugerencias no está disponible");
        setIsLoadingSuggestions(false);
        return;
      }

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

      const response = await fetchWithTimeout(webhookUrl, {
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

  const addProcedureFromList = () => {
    if (!selectedProcedure) {
      toast.error("Por favor selecciona un procedimiento");
      return;
    }

    const procedureToAdd: Procedure = {
      code: selectedProcedure.code,
      name: selectedProcedure.name,
      via: selectedProcedure.via,
    };

    // Validate procedure data
    const validationResult = procedureSchema.safeParse(procedureToAdd);

    if (!validationResult.success) {
      toast.error("El procedimiento tiene datos inválidos");
      console.error("Validation errors:", validationResult.error.errors);
      return;
    }

    setScheduledProcedures([...scheduledProcedures, validationResult.data as Procedure]);
    toast.success(`✅ ${selectedProcedure.name} agregado a programados`);

    // Reset selection
    setSelectedProcedure(null);
    setSearchTerm("");
    setOpen(false);
  };

  // Filter procedures based on category and search
  const filteredProcedures = selectedCategory === "all"
    ? PROCEDURES_LIST
    : getProceduresByCategory(PROCEDURE_CATEGORIES[selectedCategory as keyof typeof PROCEDURE_CATEGORIES]);
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
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {Object.entries(PROCEDURE_CATEGORIES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buscar Procedimiento</Label>
              <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="flex-1 justify-between"
                    >
                      {selectedProcedure
                        ? `${selectedProcedure.code} - ${selectedProcedure.name.substring(0, 30)}${selectedProcedure.name.length > 30 ? '...' : ''}`
                        : "Seleccionar procedimiento..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar procedimiento..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron procedimientos.</CommandEmpty>
                        <CommandGroup>
                          {filteredProcedures
                            .filter((proc) => {
                              if (!searchTerm) return true;
                              const term = searchTerm.toLowerCase();
                              return (
                                proc.name.toLowerCase().includes(term) ||
                                proc.code.toLowerCase().includes(term) ||
                                proc.via.toLowerCase().includes(term)
                              );
                            })
                            .slice(0, 20)
                            .map((procedure) => (
                              <CommandItem
                                key={`${procedure.code}-${procedure.via}`}
                                value={`${procedure.code} ${procedure.name} ${procedure.via}`}
                                onSelect={() => {
                                  setSelectedProcedure(procedure);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProcedure?.code === procedure.code &&
                                      selectedProcedure?.via === procedure.via
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {procedure.code} - {procedure.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Vía: {procedure.via} | {procedure.category}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  size="default"
                  onClick={addProcedureFromList}
                  disabled={!selectedProcedure}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
              {selectedProcedure && (
                <p className="text-xs text-muted-foreground mt-1">
                  Vía: {selectedProcedure.via}
                </p>
              )}
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
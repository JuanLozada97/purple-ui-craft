import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight } from "lucide-react";

const SurgicalIntervention = () => {
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
            <div>
              <h4 className="font-semibold text-base mb-3">Procedimientos realizados</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Procedimiento</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Principal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-medium">471102</TableCell>
                    <TableCell>471102 - APENDICECTOMIA VIA ABIERTA</TableCell>
                    <TableCell>BILATERAL MULTIPLE</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-center">✓</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3">Procedimientos programados</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Procedimiento</TableHead>
                    <TableHead>Descripción relacionada</TableHead>
                    <TableHead>Vía</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-accent">
                    <TableCell className="font-medium">471102</TableCell>
                    <TableCell>471102 - APENDICECTOMIA VIA ABIERTA</TableCell>
                    <TableCell>BILATERAL MUL...</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Agregar <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
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

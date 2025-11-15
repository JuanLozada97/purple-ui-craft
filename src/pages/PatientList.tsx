import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, User, Users } from "lucide-react";
import { Patient } from "@/types/patient";

// Mock data - en producción esto vendría de la API
const mockPatients: Patient[] = [
  {
    id: "1",
    poblacion: "Población",
    tipoPobl: "Recupera...",
    cama: "519Z9390",
    identificacion: "519Z9390",
    nombre: "MARIA GLADYS RENDON AGUDELO",
    edad: 61,
    entidad: "ES0064-NUEVA EPS  S .A",
    diagnostico: "ORTOPEDIA ONCOLOGICA",
    especialidad: "ORTOPEDIA ONCOLOGICA",
    tipoEstancia: "QUIRURGI",
  },
  {
    id: "2",
    poblacion: "Población",
    tipoPobl: "cam344",
    cama: "761280",
    identificacion: "761280",
    nombre: "DANIEL NEIL LINFORD",
    edad: 42,
    entidad: "ES0037-EPS Y MEDICINA PREPAGA...",
    diagnostico: "C500-TUMOR MALIGNO DEL PEZON Y AR...",
    especialidad: "ONCOLOGIA CLINICA",
    tipoEstancia: "NO ONCOL",
  },
  {
    id: "3",
    poblacion: "Población",
    tipoPobl: "RIPS",
    cama: "13863003",
    identificacion: "13863003",
    nombre: "MARCOS STIVEN CORDOBA MUÑOZ",
    edad: 29,
    entidad: "ES0002-ALIANSALUD EPS S.A PRU...",
    diagnostico: "C250-TUMOR MALIGNO DE LA CABEZA D...",
    especialidad: "ONCOLOGIA CLINICA",
    tipoEstancia: "NO ONCOL",
  },
  {
    id: "4",
    poblacion: "Población",
    tipoPobl: "Quirófano 8",
    cama: "12000251",
    identificacion: "12000251",
    nombre: "PEPITO CARRERA",
    edad: 30,
    entidad: "999-PARTICULARES",
    diagnostico: "J069-INFECCION AGUDA DE LAS VIAS R...",
    especialidad: "ONCOLOGIA CLINICA",
    tipoEstancia: "QUIRURGI",
  },
  {
    id: "5",
    poblacion: "Población",
    tipoPobl: "Quirófano 7",
    cama: "100012514",
    identificacion: "100012514",
    nombre: "JONATHAN GEORGE TORRES SAGANDVE",
    edad: 36,
    entidad: "ES0037-EPS Y MEDICINA PREPAGA...",
    diagnostico: "A010-FIEBRE TIFOIDEA",
    especialidad: "ONCOLOGIA CLINICA",
    tipoEstancia: "NO ONCOL",
  },
  {
    id: "6",
    poblacion: "Población",
    tipoPobl: "Quirófano 6",
    cama: "1000613",
    identificacion: "1000613",
    nombre: "JOSE GOODFEEL BERNAL OLARTE",
    edad: 67,
    entidad: "ES0037-EPS Y MEDICINA PREPAGA...",
    diagnostico: "A010-FIEBRE TIFOIDEA",
    especialidad: "NEUROPSICOLOGIA",
    tipoEstancia: "QUIRURGI",
  },
];

const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handlePatientClick = (patientId: string) => {
    navigate(`/surgical-report/${patientId}`);
  };

  const getStatusBadgeColor = (tipo: string) => {
    if (tipo.includes("Quirófano")) return "default";
    if (tipo.includes("Recupera")) return "secondary";
    return "outline";
  };

  const getStayTypeBadgeColor = (tipo: string) => {
    if (tipo === "QUIRURGI") return "default";
    if (tipo === "NO ONCOL") return "secondary";
    if (tipo === "CUIDADO") return "outline";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <Card className="border-t-4 border-t-medical-blue shadow-lg">
          <CardHeader className="bg-gradient-to-r from-medical-blue/10 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-medical-blue rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-medical-blue">
                    Dashboard Médicos - Indigo Vie Cloud Platform
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ubicación: CENTRO ATENCION MARAYA - CIRUGIA MARAYA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-medical-blue" />
                <span className="text-sm font-medium">Dr. Usuario</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Patient List Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-accent/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6 text-medical-blue" />
                Pacientes en espera y/o pacientes hospitalizados
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, identificación, cama, diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">#</TableHead>
                    <TableHead className="font-semibold">Población</TableHead>
                    <TableHead className="font-semibold">Tipo Pobl.</TableHead>
                    <TableHead className="font-semibold">Cama</TableHead>
                    <TableHead className="font-semibold">Identificación</TableHead>
                    <TableHead className="font-semibold">Paciente</TableHead>
                    <TableHead className="font-semibold">Edad</TableHead>
                    <TableHead className="font-semibold">Entidad</TableHead>
                    <TableHead className="font-semibold">Diagnóstico</TableHead>
                    <TableHead className="font-semibold">Especialidad</TableHead>
                    <TableHead className="font-semibold">Tipo Estancia</TableHead>
                    <TableHead className="font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No se encontraron pacientes</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <TableRow
                        key={patient.id}
                        className="hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => handlePatientClick(patient.id)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {patient.poblacion}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeColor(patient.tipoPobl)}>
                            {patient.tipoPobl}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{patient.cama}</TableCell>
                        <TableCell className="font-mono text-sm">{patient.identificacion}</TableCell>
                        <TableCell className="font-semibold max-w-xs truncate">
                          {patient.nombre}
                        </TableCell>
                        <TableCell className="text-center">
                          {patient.edad} años
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {patient.entidad}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {patient.diagnostico}
                        </TableCell>
                        <TableCell className="text-sm">{patient.especialidad}</TableCell>
                        <TableCell>
                          <Badge variant={getStayTypeBadgeColor(patient.tipoEstancia)}>
                            {patient.tipoEstancia}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatientClick(patient.id);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            Informe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer info */}
            <div className="border-t bg-muted/20 p-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-6">
                <span>
                  <strong className="text-foreground">{filteredPatients.length}</strong> pacientes
                  encontrados
                </span>
                <span>
                  Quirófanos activos:{" "}
                  <strong className="text-foreground">
                    {filteredPatients.filter((p) => p.tipoPobl.includes("Quirófano")).length}
                  </strong>
                </span>
              </div>
              <div className="text-xs">
                Última actualización: {new Date().toLocaleString("es-ES")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pacientes</p>
                  <p className="text-2xl font-bold text-medical-blue">{patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-medical-blue/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Quirófano</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {patients.filter((p) => p.tipoPobl.includes("Quirófano")).length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-600/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Oncología</p>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter((p) => p.especialidad.includes("ONCOLOGIA")).length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quirúrgicos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {patients.filter((p) => p.tipoEstancia === "QUIRURGI").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientList;

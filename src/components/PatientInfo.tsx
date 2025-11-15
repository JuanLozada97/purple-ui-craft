import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types/patient";

interface PatientInfoProps {
  patient: Patient | undefined;
}

const PatientInfo = ({ patient }: PatientInfoProps) => {
  if (!patient) {
    return (
      <Card className="bg-secondary border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-primary">📋</span>
            Paciente no encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">Dashboard médico</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">Informe quirúrgico</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-primary">📋</span>
          Paciente: {patient.identificacion} {patient.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Dashboard médico</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">Informe quirúrgico</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;

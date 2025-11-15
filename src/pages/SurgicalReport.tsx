import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PatientInfo from "@/components/PatientInfo";
import SurgicalIntervention, { Procedure } from "@/components/SurgicalIntervention";
import SurgicalDescription from "@/components/SurgicalDescription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockPatients } from "@/data/patients";

const SurgicalReport = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");

  const patient = mockPatients.find((p) => p.id === patientId);
  
  // Estados de Descripción Quirúrgica
  const [hallazgos, setHallazgos] = useState("");
  const [detalleQuirurgico, setDetalleQuirurgico] = useState("");
  const [complicaciones, setComplicaciones] = useState("");
  
  // Estados de Intervención Practicada
  const [suggestedProcedures, setSuggestedProcedures] = useState<Procedure[]>([]);
  const [scheduledProcedures, setScheduledProcedures] = useState<Procedure[]>([
    {
      code: "471102",
      name: "471102 - APENDICECTOMIA VIA ABIERTA",
      via: "BILATERAL MULTIPLE",
    },
  ]);
  const [performedProcedures, setPerformedProcedures] = useState<Procedure[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado de pacientes
        </Button>

        <PatientInfo patient={patient} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="description">Descripción quirúrgica</TabsTrigger>
            <TabsTrigger value="intervention">Intervención practicada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <SurgicalDescription 
              onNext={() => setActiveTab("intervention")}
              hallazgos={hallazgos}
              setHallazgos={setHallazgos}
              detalleQuirurgico={detalleQuirurgico}
              setDetalleQuirurgico={setDetalleQuirurgico}
              complicaciones={complicaciones}
              setComplicaciones={setComplicaciones}
              scheduledProcedures={scheduledProcedures}
            />
          </TabsContent>
          
          <TabsContent value="intervention" className="mt-6">
            <SurgicalIntervention 
              suggestedProcedures={suggestedProcedures}
              setSuggestedProcedures={setSuggestedProcedures}
              scheduledProcedures={scheduledProcedures}
              setScheduledProcedures={setScheduledProcedures}
              performedProcedures={performedProcedures}
              setPerformedProcedures={setPerformedProcedures}
              hallazgos={hallazgos}
              detalleQuirurgico={detalleQuirurgico}
              complicaciones={complicaciones}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SurgicalReport;

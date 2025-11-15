import Header from "@/components/Header";
import PatientInfo from "@/components/PatientInfo";
import SurgicalIntervention from "@/components/SurgicalIntervention";
import SurgicalDescription from "@/components/SurgicalDescription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <PatientInfo />
        
        <Tabs defaultValue="intervention" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="intervention">Intervención practicada</TabsTrigger>
            <TabsTrigger value="description">Descripción quirúrgica</TabsTrigger>
          </TabsList>
          
          <TabsContent value="intervention" className="mt-6">
            <SurgicalIntervention />
          </TabsContent>
          
          <TabsContent value="description" className="mt-6">
            <SurgicalDescription />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

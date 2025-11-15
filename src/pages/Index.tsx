import { useState } from "react";
import Header from "@/components/Header";
import PatientInfo from "@/components/PatientInfo";
import SurgicalIntervention from "@/components/SurgicalIntervention";
import SurgicalDescription from "@/components/SurgicalDescription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <PatientInfo />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="description">Descripción quirúrgica</TabsTrigger>
            <TabsTrigger value="intervention">Intervención practicada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <SurgicalDescription onNext={() => setActiveTab("intervention")} />
          </TabsContent>
          
          <TabsContent value="intervention" className="mt-6">
            <SurgicalIntervention />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

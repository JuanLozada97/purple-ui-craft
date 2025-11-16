import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PatientInfo from "@/components/PatientInfo";
import SurgicalIntervention, { Procedure } from "@/components/SurgicalIntervention";
import SurgicalDescription from "@/components/SurgicalDescription";
import SurgicalTeam from "@/components/SurgicalTeam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic } from "lucide-react";
import { mockPatients } from "@/data/patients";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useGeminiLiveChunks } from "@/hooks/useGeminiLiveChunks";
import { useGeminiRecorder } from "@/hooks/useGeminiRecorder";
import { appendToActiveTextarea } from "@/lib/appendToActiveTextarea";
import { useToast } from "@/components/ui/use-toast";
import { SurgicalTeamMember } from "@/types/surgical-team";

const SurgicalReport = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");
  const { toast } = useToast();

  const { isSupported, isListening, error, start, toggle } = useSpeechRecognition({
    lang: "es-ES",
    onFinalResult: (text) => {
      const ok = appendToActiveTextarea(text + " ");
      if (!ok) {
        toast({
          title: "No hay un campo activo",
          description: "Haz clic dentro del área de texto antes de dictar.",
          variant: "destructive",
        });
      }
    },
  });

  // Gemini: En vivo por fragmentos
  const {
    isRecording: isLiveRecording,
    start: startLive,
    stop: stopLive,
  } = useGeminiLiveChunks({
    timesliceMs: 2000,
    onPartial: (text) => {
      const ok = appendToActiveTextarea(text + " ");
      if (!ok) {
        toast({
          title: "No hay un campo activo",
          description: "Haz clic dentro del área de texto antes de dictar.",
          variant: "destructive",
        });
      }
    },
    onError: (msg) =>
      toast({
        title: "Error de dictado (Gemini en vivo)",
        description: msg,
        variant: "destructive",
      }),
  });

  // Gemini: Grabar y transcribir
  const {
    isRecording: isRecordingGemini,
    isTranscribing,
    error: geminiRecordError,
    start: startRecord,
    stopAndTranscribe,
  } = useGeminiRecorder();

  // Evitar toast spam: disparar una sola vez por valor de error
  const lastWebSpeechErrorRef = useRef<string | null>(null);
  const lastGeminiErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (error && error !== "unsupported" && error !== lastWebSpeechErrorRef.current) {
      toast({
        title: "Error de dictado",
        description: `Ocurrió un error: ${error}`,
        variant: "destructive",
      });
      lastWebSpeechErrorRef.current = error;
    }
    if (!error) {
      lastWebSpeechErrorRef.current = null;
    }
  }, [error, toast]);

  useEffect(() => {
    if (geminiRecordError && geminiRecordError !== lastGeminiErrorRef.current) {
      toast({
        title: "Error de dictado (Gemini grabación)",
        description: geminiRecordError,
        variant: "destructive",
      });
      lastGeminiErrorRef.current = geminiRecordError;
    }
    if (!geminiRecordError) {
      lastGeminiErrorRef.current = null;
    }
  }, [geminiRecordError, toast]);

  const patient = mockPatients.find((p) => p.id === patientId);
  
  // Estados de Equipo Quirúrgico
  const [teamMembers, setTeamMembers] = useState<SurgicalTeamMember[]>([]);
  
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
        {/* Barra superior: volver + dictado global */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al listado de pacientes
          </Button>
          <div className="flex items-center gap-2 hidden">
            {/* Web Speech existente */}
            <Button
              variant={isListening ? "default" : "outline"}
              className="gap-2"
              onClick={() => {
                if (!isSupported) {
                  toast({
                    title: "Dictado no soportado",
                    description: "Tu navegador no soporta reconocimiento de voz.",
                    variant: "destructive",
                  });
                  return;
                }
                if (!isListening) start();
                else toggle();
              }}
            >
              <Mic className="h-4 w-4" />
              {isListening ? "Escuchando…" : "Dictar"}
            </Button>

            {/* Gemini en vivo */}
            <Button
              variant={isLiveRecording ? "default" : "outline"}
              className="gap-2"
              onClick={() => {
                if (!isLiveRecording) startLive();
                else stopLive();
              }}
            >
              <Mic className="h-4 w-4" />
              {isLiveRecording ? "En vivo (Gemini)..." : "En vivo (Gemini)"}
            </Button>

            {/* Gemini grabar y transcribir */}
            <Button
              variant={isRecordingGemini || isTranscribing ? "default" : "outline"}
              className="gap-2"
              disabled={isTranscribing}
              onClick={async () => {
                if (!isRecordingGemini) {
                  startRecord();
                } else {
                  const text = await stopAndTranscribe();
                  if (text && text.trim()) {
                    const ok = appendToActiveTextarea(text.trim() + " ");
                    if (!ok) {
                      toast({
                        title: "No hay un campo activo",
                        description: "Haz clic dentro del área de texto antes de dictar.",
                        variant: "destructive",
                      });
                    }
                  }
                }
              }}
            >
              <Mic className="h-4 w-4" />
              {isTranscribing
                ? "Transcribiendo…"
                : isRecordingGemini
                ? "Grabando (Gemini)…"
                : "Grabar y transcribir (Gemini)"}
            </Button>
          </div>
        </div>

        <PatientInfo patient={patient} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="team" className="px-4">Equipo quirúrgico</TabsTrigger>
            <TabsTrigger value="description" className="px-4">Descripción quirúrgica</TabsTrigger>
            <TabsTrigger value="intervention" className="px-4">Intervención practicada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="mt-6">
            <SurgicalTeam 
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              onNext={() => setActiveTab("description")}
            />
          </TabsContent>
          
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

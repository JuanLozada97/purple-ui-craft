import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { SurgicalTeamMember, TeamMemberType } from "@/types/surgical-team";
import { SURGICAL_TEAM_NAMES } from "@/data/surgical-team";

interface SurgicalTeamProps {
  teamMembers: SurgicalTeamMember[];
  setTeamMembers: (members: SurgicalTeamMember[]) => void;
  onNext?: () => void;
}

const TEAM_MEMBER_LABELS: Record<TeamMemberType, string> = {
  cirujano: "Cirujano",
  anestesiologo: "Anestesiólogo",
  instrumentador: "Instrumentador",
  ayudante: "Ayudante",
  circulante: "Circulante",
  otro: "Otro",
};

const SurgicalTeam = ({ teamMembers, setTeamMembers, onNext }: SurgicalTeamProps) => {
  const [selectedMembers, setSelectedMembers] = useState<Record<TeamMemberType, string>>({
    cirujano: "",
    anestesiologo: "",
    instrumentador: "",
    ayudante: "",
    circulante: "",
    otro: "",
  });

  const addMember = (type: TeamMemberType) => {
    const selectedName = selectedMembers[type];
    
    if (!selectedName) {
      toast.error(`Por favor selecciona un ${TEAM_MEMBER_LABELS[type].toLowerCase()}`);
      return;
    }

    // Verificar si ya existe este miembro
    const exists = teamMembers.some(
      (member) => member.type === type && member.name === selectedName
    );

    if (exists) {
      toast.error(`Este ${TEAM_MEMBER_LABELS[type].toLowerCase()} ya está agregado`);
      return;
    }

    const newMember: SurgicalTeamMember = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      name: selectedName,
      isPrincipal: type === "cirujano" ? false : undefined,
    };

    // Si es cirujano y es el primero, marcarlo como principal automáticamente
    if (type === "cirujano" && teamMembers.filter((m) => m.type === "cirujano").length === 0) {
      newMember.isPrincipal = true;
    }

    setTeamMembers([...teamMembers, newMember]);
    setSelectedMembers({ ...selectedMembers, [type]: "" });
    toast.success(`${TEAM_MEMBER_LABELS[type]} agregado exitosamente`);
  };

  const removeMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    toast.success("Participante eliminado");
  };

  const togglePrincipal = (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    if (!member || member.type !== "cirujano") return;

    // Si se está marcando como principal, desmarcar todos los demás cirujanos
    const updatedMembers = teamMembers.map((m) => {
      if (m.type === "cirujano" && m.id === id) {
        return { ...m, isPrincipal: !m.isPrincipal };
      }
      if (m.type === "cirujano" && m.id !== id) {
        return { ...m, isPrincipal: false };
      }
      return m;
    });

    setTeamMembers(updatedMembers);
  };

  const getTypeLabel = (type: TeamMemberType): string => {
    return TEAM_MEMBER_LABELS[type];
  };

  return (
    <Card>
      <CardHeader className="bg-accent">
        <CardTitle className="text-primary flex items-center gap-2">
          <span>👥</span>
          Equipo quirúrgico
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Panel de selección */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Agregar participantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cirujano */}
            <div className="space-y-2">
              <Label htmlFor="cirujano-select">Cirujano</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.cirujano}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, cirujano: value })
                  }
                >
                  <SelectTrigger id="cirujano-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar cirujano..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.cirujano.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("cirujano")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Anestesiólogo */}
            <div className="space-y-2">
              <Label htmlFor="anestesiologo-select">Anestesiólogo</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.anestesiologo}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, anestesiologo: value })
                  }
                >
                  <SelectTrigger id="anestesiologo-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar anestesiólogo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.anestesiologo.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("anestesiologo")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Instrumentador */}
            <div className="space-y-2">
              <Label htmlFor="instrumentador-select">Instrumentador</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.instrumentador}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, instrumentador: value })
                  }
                >
                  <SelectTrigger id="instrumentador-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar instrumentador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.instrumentador.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("instrumentador")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Ayudante */}
            <div className="space-y-2">
              <Label htmlFor="ayudante-select">Ayudante</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.ayudante}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, ayudante: value })
                  }
                >
                  <SelectTrigger id="ayudante-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar ayudante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.ayudante.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("ayudante")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Circulante */}
            <div className="space-y-2">
              <Label htmlFor="circulante-select">Circulante</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.circulante}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, circulante: value })
                  }
                >
                  <SelectTrigger id="circulante-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar circulante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.circulante.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("circulante")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Otro */}
            <div className="space-y-2">
              <Label htmlFor="otro-select">Otro</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedMembers.otro}
                  onValueChange={(value) =>
                    setSelectedMembers({ ...selectedMembers, otro: value })
                  }
                >
                  <SelectTrigger id="otro-select" className="flex-1">
                    <SelectValue placeholder="Seleccionar otro participante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGICAL_TEAM_NAMES.otro.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMember("otro")} size="default">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de participantes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Participantes agregados</h3>
          {teamMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[120px]">Principal</TableHead>
                  <TableHead className="w-[100px]">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {getTypeLabel(member.type)}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      {member.type === "cirujano" ? (
                        <Checkbox
                          checked={member.isPrincipal || false}
                          onCheckedChange={() => togglePrincipal(member.id)}
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8 border rounded-lg">
              No hay participantes agregados. Usa los selectores arriba para agregar miembros del equipo.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">← Atrás</Button>
          <Button 
            variant="outline"
            onClick={() => onNext?.()}
          >
            Siguiente →
          </Button>
          <Button variant="outline">Salir</Button>
          <Button variant="secondary">Ayuda</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurgicalTeam;


export type TeamMemberType =
  | "cirujano"
  | "anestesiologo"
  | "instrumentador"
  | "ayudante"
  | "circulante"
  | "otro";

export interface SurgicalTeamMember {
  id: string;
  type: TeamMemberType;
  name: string;
  isPrincipal?: boolean; // Solo para cirujanos
}


/**
 * Patient types for the medical dashboard
 */

export interface Patient {
  id: string;
  poblacion: string;
  tipoPobl: string;
  cama: string;
  identificacion: string;
  nombre: string;
  edad: number;
  entidad: string;
  diagnostico: string;
  especialidad: string;
  tipoEstancia: string;
  aislamiento?: string;
}

export type PatientStatus =
  | "Población"
  | "Quirófano"
  | "Recuperación"
  | "Maternas"
  | "Admisión";

export type Department =
  | "ORTOPEDIA ONCOLOGICA"
  | "ONCOLOGIA CLINICA"
  | "NEUROPSICOLOGIA"
  | "MEDICINA GENERAL";

export type StayType =
  | "QUIRURGI"
  | "NO ONCOL"
  | "CUIDADO";

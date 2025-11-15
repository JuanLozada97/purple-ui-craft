export interface ValidationAlert {
  campo: "hallazgos" | "Detalle quirurgico" | "complicaciones" | "procedimientos_realizados" | "procedimientos_programados" | "consistencia_general";
  tipo: "dato_faltante" | "dato_incompleto" | "dato_confuso" | "inconsistencia";
  descripcion_alerta: string;
  impacto: "alto" | "medio" | "bajo";
  preguntas_guia: string[];
}

export interface ValidationResponse {
  tiene_alertas: boolean;
  nivel_gravedad_global: "alta" | "media" | "baja";
  alertas: ValidationAlert[];
}

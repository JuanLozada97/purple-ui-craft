import { z } from "zod";

/**
 * Validation schemas for surgical forms
 */

// Schema for Surgical Description form
export const surgicalDescriptionSchema = z.object({
  hallazgos: z
    .string()
    .min(10, "Los hallazgos operatorios deben tener al menos 10 caracteres")
    .max(5000, "Los hallazgos operatorios no pueden exceder 5000 caracteres")
    .refine(
      (val) => val.trim().length >= 10,
      "Los hallazgos operatorios no pueden consistir solo de espacios"
    ),
  detalleQuirurgico: z
    .string()
    .min(10, "El detalle quirúrgico debe tener al menos 10 caracteres")
    .max(5000, "El detalle quirúrgico no puede exceder 5000 caracteres")
    .refine(
      (val) => val.trim().length >= 10,
      "El detalle quirúrgico no puede consistir solo de espacios"
    ),
  complicaciones: z
    .string()
    .max(5000, "Las complicaciones no pueden exceder 5000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type SurgicalDescriptionFormData = z.infer<typeof surgicalDescriptionSchema>;

// Schema for Procedure
export const procedureSchema = z.object({
  code: z
    .string()
    .min(1, "El código del procedimiento es requerido")
    .max(50, "El código no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9\-_\s]+$/, "El código solo puede contener letras, números, guiones y espacios"),
  name: z
    .string()
    .min(3, "El nombre del procedimiento debe tener al menos 3 caracteres")
    .max(500, "El nombre no puede exceder 500 caracteres"),
  via: z
    .string()
    .min(2, "La vía de acceso es requerida")
    .max(100, "La vía de acceso no puede exceder 100 caracteres"),
  reason: z
    .string()
    .max(500, "La razón no puede exceder 500 caracteres")
    .optional(),
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad debe ser al menos 1")
    .max(99, "La cantidad no puede exceder 99")
    .optional(),
  isPrimary: z
    .boolean()
    .optional(),
});

export type ProcedureFormData = z.infer<typeof procedureSchema>;

// Schema for Surgical Intervention form
export const surgicalInterventionSchema = z.object({
  suggestedProcedures: z.array(procedureSchema).optional(),
  scheduledProcedures: z.array(procedureSchema).min(1, "Debe haber al menos un procedimiento programado"),
  performedProcedures: z
    .array(procedureSchema)
    .min(1, "Debe haber al menos un procedimiento realizado")
    .refine(
      (procedures) => procedures.filter(p => p.isPrimary).length === 1,
      "Debe haber exactamente un procedimiento principal"
    ),
});

export type SurgicalInterventionFormData = z.infer<typeof surgicalInterventionSchema>;

// Schema for AI Suggestion Request
export const aiSuggestionRequestSchema = z.object({
  diagnosis: z
    .string()
    .min(3, "El diagnóstico debe tener al menos 3 caracteres")
    .max(500, "El diagnóstico no puede exceder 500 caracteres"),
  surgeryType: z
    .string()
    .min(3, "El tipo de cirugía debe tener al menos 3 caracteres")
    .max(200, "El tipo de cirugía no puede exceder 200 caracteres"),
  patientInfo: z
    .string()
    .max(500, "La información del paciente no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type AISuggestionRequest = z.infer<typeof aiSuggestionRequestSchema>;

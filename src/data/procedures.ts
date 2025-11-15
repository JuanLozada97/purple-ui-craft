/**
 * Lista predefinida de procedimientos médicos y quirúrgicos
 * Códigos CUPS (Clasificación Única de Procedimientos en Salud)
 */

export interface ProcedureTemplate {
  code: string;
  name: string;
  via: string;
  category: string;
}

export const PROCEDURE_CATEGORIES = {
  CIRUGIA_GENERAL: "Cirugía General",
  ORTOPEDIA: "Ortopedia y Traumatología",
  GINECOLOGIA: "Ginecología y Obstetricia",
  UROLOGIA: "Urología",
  CIRUGIA_VASCULAR: "Cirugía Vascular",
  NEUROCIRUGIA: "Neurocirugía",
  OFTALMOLOGIA: "Oftalmología",
  OTORRINO: "Otorrinolaringología",
  CIRUGIA_PLASTICA: "Cirugía Plástica",
  ONCOLOGIA: "Oncología Quirúrgica",
} as const;

export const PROCEDURE_VIAS = [
  "ABIERTA",
  "LAPAROSCOPICA",
  "BILATERAL MULTIPLE",
  "ENDOSCOPICA",
  "PERCUTANEA",
  "TORACOSCOPICA",
  "ARTROSCOPICA",
  "HISTEROSCOPICA",
  "ROBOTICA",
] as const;

export const PROCEDURES_LIST: ProcedureTemplate[] = [
  // CIRUGÍA GENERAL
  {
    code: "471102",
    name: "APENDICECTOMIA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "471103",
    name: "APENDICECTOMIA",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "470101",
    name: "COLECISTECTOMIA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "470102",
    name: "COLECISTECTOMIA",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "458101",
    name: "HERNIOPLASTIA INGUINAL UNILATERAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "458102",
    name: "HERNIOPLASTIA INGUINAL BILATERAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "458103",
    name: "HERNIOPLASTIA UMBILICAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "458104",
    name: "HERNIOPLASTIA INCISIONAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "480101",
    name: "GASTRECTOMIA TOTAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "480102",
    name: "GASTRECTOMIA PARCIAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "460101",
    name: "TIROIDECTOMIA TOTAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "460102",
    name: "TIROIDECTOMIA PARCIAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "485101",
    name: "COLECTOMIA PARCIAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "485102",
    name: "COLECTOMIA TOTAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },
  {
    code: "496101",
    name: "HEMORROIDECTOMIA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_GENERAL,
  },

  // ORTOPEDIA Y TRAUMATOLOGÍA
  {
    code: "793101",
    name: "REDUCCION ABIERTA Y FIJACION INTERNA FRACTURA FEMUR",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "793102",
    name: "REDUCCION ABIERTA Y FIJACION INTERNA FRACTURA TIBIA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "793103",
    name: "REDUCCION ABIERTA Y FIJACION INTERNA FRACTURA HUMERO",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "815101",
    name: "ARTROPLASTIA TOTAL DE CADERA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "815102",
    name: "ARTROPLASTIA TOTAL DE RODILLA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "815103",
    name: "ARTROPLASTIA DE HOMBRO",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "803101",
    name: "ARTROSCOPIA DE RODILLA CON MENISCECTOMIA",
    via: "ARTROSCOPICA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "803102",
    name: "ARTROSCOPIA DE HOMBRO",
    via: "ARTROSCOPICA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "840101",
    name: "LIBERACION TUNEL CARPIANO",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },
  {
    code: "772101",
    name: "AMPUTACION SUPRACONDILEA DE MIEMBRO INFERIOR",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.ORTOPEDIA,
  },

  // GINECOLOGÍA Y OBSTETRICIA
  {
    code: "741101",
    name: "CESAREA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "688101",
    name: "HISTERECTOMIA ABDOMINAL TOTAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "688102",
    name: "HISTERECTOMIA VAGINAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "688103",
    name: "HISTERECTOMIA LAPAROSCOPICA",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "660101",
    name: "SALPINGOCLASIA BILATERAL",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "654101",
    name: "OOFORECTOMIA UNILATERAL",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "654102",
    name: "OOFORECTOMIA BILATERAL",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },
  {
    code: "700101",
    name: "CONIZACION DE CERVIX",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.GINECOLOGIA,
  },

  // UROLOGÍA
  {
    code: "605101",
    name: "NEFRECTOMIA RADICAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "605102",
    name: "NEFRECTOMIA PARCIAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "576101",
    name: "RESECCION TRANSURETRAL DE PROSTATA (RTU-P)",
    via: "ENDOSCOPICA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "604101",
    name: "PROSTATECTOMIA RADICAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "604102",
    name: "PROSTATECTOMIA RADICAL",
    via: "LAPAROSCOPICA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "573101",
    name: "CISTECTOMIA PARCIAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "573102",
    name: "CISTECTOMIA RADICAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "630101",
    name: "ORQUIDECTOMIA UNILATERAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },
  {
    code: "630102",
    name: "ORQUIDECTOMIA BILATERAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.UROLOGIA,
  },

  // CIRUGÍA VASCULAR
  {
    code: "390101",
    name: "BYPASS AORTO-BIFEMORAL",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_VASCULAR,
  },
  {
    code: "390102",
    name: "BYPASS FEMORO-POPLITEO",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_VASCULAR,
  },
  {
    code: "385101",
    name: "ENDARTERECTOMIA CAROTIDEA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_VASCULAR,
  },
  {
    code: "389101",
    name: "ANGIOPLASTIA PERCUTANEA",
    via: "PERCUTANEA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_VASCULAR,
  },
  {
    code: "383101",
    name: "FISTULA ARTERIOVENOSA PARA DIALISIS",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.CIRUGIA_VASCULAR,
  },

  // NEUROCIRUGÍA
  {
    code: "015101",
    name: "CRANEOTOMIA PARA EVACUACION DE HEMATOMA",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.NEUROCIRUGIA,
  },
  {
    code: "015102",
    name: "CRANEOTOMIA PARA RESECCION DE TUMOR",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.NEUROCIRUGIA,
  },
  {
    code: "033101",
    name: "LAMINECTOMIA LUMBAR",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.NEUROCIRUGIA,
  },
  {
    code: "033102",
    name: "DISCECTOMIA LUMBAR",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.NEUROCIRUGIA,
  },
  {
    code: "037101",
    name: "FIJACION VERTEBRAL CON INSTRUMENTACION",
    via: "ABIERTA",
    category: PROCEDURE_CATEGORIES.NEUROCIRUGIA,
  },
];

/**
 * Get procedures by category
 */
export const getProceduresByCategory = (category: string) => {
  return PROCEDURES_LIST.filter((proc) => proc.category === category);
};

/**
 * Search procedures by name or code
 */
export const searchProcedures = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return PROCEDURES_LIST.filter(
    (proc) =>
      proc.name.toLowerCase().includes(term) ||
      proc.code.toLowerCase().includes(term) ||
      proc.via.toLowerCase().includes(term)
  );
};

/**
 * Get unique categories
 */
export const getCategories = () => {
  return Array.from(new Set(PROCEDURES_LIST.map((proc) => proc.category)));
};

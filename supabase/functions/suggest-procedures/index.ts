import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Sanitize input for AI prompts to prevent injection attacks
 */
function sanitizeForAIPrompt(input: string | undefined | null, maxLength: number = 500): string {
  if (!input) return "No especificado";

  // Remove control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Remove potentially dangerous sequences
  sanitized = sanitized
    .replace(/[<>{}[\]]/g, '')
    .replace(/([!?.]){3,}/g, '$1$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit length
  sanitized = sanitized.substring(0, maxLength);

  return sanitized || "No especificado";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosis, surgeryType, patientInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Sanitize inputs to prevent prompt injection attacks
    const sanitizedDiagnosis = sanitizeForAIPrompt(diagnosis, 200);
    const sanitizedSurgeryType = sanitizeForAIPrompt(surgeryType, 100);
    const sanitizedPatientInfo = sanitizeForAIPrompt(patientInfo, 300);

    console.log("Generating procedure suggestions for:", {
      diagnosis: sanitizedDiagnosis,
      surgeryType: sanitizedSurgeryType
    });

    const prompt = `Eres un asistente médico experto en cirugía. Basándote en la siguiente información:

- Diagnóstico pre-operatorio: ${sanitizedDiagnosis}
- Tipo de cirugía: ${sanitizedSurgeryType}
- Información adicional: ${sanitizedPatientInfo}

Sugiere entre 3 y 5 procedimientos quirúrgicos apropiados y médicamente justificados.

Para cada procedimiento, proporciona:
1. Código del procedimiento (formato estándar médico)
2. Nombre completo del procedimiento
3. Vía de acceso (IGUAL VIA IGUAL ESPECIALISTA CIRUGIA MULTIPLE, ABIERTA, LAPAROSCÓPICA, etc.)
4. Breve razón médica de por qué se sugiere este procedimiento

Responde en formato JSON con esta estructura exacta:
{
  "suggestions": [
    {
      "code": "código",
      "name": "nombre del procedimiento",
      "via": "vía de acceso",
      "reason": "razón médica breve"
    }
  ]
}

Solo incluye procedimientos médicamente apropiados y comunes para el caso descrito.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Eres un asistente médico experto. Responde siempre en formato JSON válido." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Por favor, intenta de nuevo más tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes. Por favor, añade créditos a tu cuenta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error al comunicarse con el servicio de IA");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("AI response content:", content);
    
    // Parse JSON from the response
    let suggestions;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      suggestions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      throw new Error("Error al procesar la respuesta del servicio de IA");
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in suggest-procedures function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

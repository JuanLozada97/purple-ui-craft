import { GoogleGenerativeAI } from "@google/generative-ai";

type TranscribeOptions = {
  mimeType?: string;
  instruction?: string;
};

export function getGeminiModel() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY no está definido en el entorno.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName =
    (import.meta.env as any).VITE_GEMINI_MODEL || "gemini-1.5-flash";
  return genAI.getGenerativeModel({ model: modelName });
}

async function blobToBase64(blob: Blob): Promise<string> {
  // FileReader es el método más robusto en navegadores para extraer base64
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  // dataUrl: "data:<mime>;base64,<data>"
  const commaIdx = dataUrl.indexOf(",");
  return commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
}

export async function transcribeBlobWithGemini(
  blob: Blob,
  opts: TranscribeOptions = {},
): Promise<string> {
  const model = getGeminiModel();
  const base64Audio = await blobToBase64(blob);
  const mimeType = opts.mimeType || blob.type || "audio/webm";
  const instruction =
    opts.instruction ||
    "Transcribe fielmente al español el siguiente audio clínico/quirúrgico. " +
      "No inventes contenido. Mantén términos médicos y acrónimos. " +
      "Devuelve solo el texto transcrito, sin prefijos.";

  // Responses API (texto como salida)
  // El formato correcto requiere que texto y audio estén en un array de parts
  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [
        { text: instruction },
        { inlineData: { mimeType, data: base64Audio } },
      ],
    }],
  });

  return result.response.text();
}

type SpeakOptions = {
  voice?: string; // e.g. "Puck", "Dana"
  format?: "wav" | "mp3";
};

export async function speakTextWithGemini(
  text: string,
  options: SpeakOptions = {},
): Promise<Blob> {
  const model = getGeminiModel();
  const voice = options.voice || "Puck";
  const format = options.format || "wav";

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      audioConfig: { voice, format },
    },
  } as any);

  // Extraer audio base64 del primer part
  const part = response.response.candidates?.[0]?.content?.parts?.[0];
  const base64: string | undefined = part?.inlineData?.data;
  if (!base64) {
    throw new Error("No se obtuvo audio de la respuesta de Gemini.");
  }
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const mime = format === "mp3" ? "audio/mpeg" : "audio/wav";
  return new Blob([bytes], { type: mime });
}



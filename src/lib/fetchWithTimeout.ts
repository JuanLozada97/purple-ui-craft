/**
 * Wrapper around fetch that enforces a timeout (default 2 minutes) using AbortController.
 */
export async function fetchWithTimeout(
  resource: RequestInfo | URL,
  options: RequestInit = {},
  timeout = 120_000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("⏱️ La solicitud a n8n excedió el tiempo máximo de espera (2 minutos).");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

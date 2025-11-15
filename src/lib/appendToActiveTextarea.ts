/**
 * Inserta texto en el textarea que esté actualmente enfocado,
 * respetando la selección y moviendo el caret al final de la inserción.
 * Dispara el evento `input` para que React sincronice el valor.
 */
export function appendToActiveTextarea(text: string): boolean {
  const active = document.activeElement as HTMLTextAreaElement | null;
  if (!active || active.tagName !== "TEXTAREA") return false;

  const start = active.selectionStart ?? active.value.length;
  const end = active.selectionEnd ?? active.value.length;

  // Respetar maxLength del textarea si está definido (> -1). Por defecto es -1 (sin límite).
  const max = active.maxLength; // -1 si no se estableció
  let toInsert = text;
  if (typeof max === "number" && max > -1) {
    const currentLength = active.value.length;
    const selectedLength = Math.max(0, end - start);
    const remaining = max - (currentLength - selectedLength);
    if (remaining <= 0) return false;
    if (toInsert.length > remaining) {
      toInsert = toInsert.slice(0, Math.max(0, remaining));
    }
  }

  active.setRangeText(toInsert, start, end, "end");
  active.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}



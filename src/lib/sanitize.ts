/**
 * Sanitization utilities for user inputs
 * Protects against XSS, injection attacks, and data quality issues
 */

/**
 * Sanitize a string input by removing potentially dangerous characters
 * and limiting its length
 */
export function sanitizeInput(input: string | undefined | null, maxLength: number = 5000): string {
  if (!input) return "";

  // Remove control characters and null bytes
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize whitespace (replace multiple spaces/newlines with single ones)
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  return sanitized.substring(0, maxLength);
}

/**
 * Sanitize medical text input (used for surgical descriptions, findings, etc.)
 * More permissive than general input, allows newlines and special medical chars
 */
export function sanitizeMedicalText(input: string | undefined | null, maxLength: number = 5000): string {
  if (!input) return "";

  // Remove only null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim excessive whitespace but keep meaningful line breaks
  sanitized = sanitized.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines

  // Trim edges
  sanitized = sanitized.trim();

  // Limit length
  return sanitized.substring(0, maxLength);
}

/**
 * Sanitize input for AI prompts
 * Prevents prompt injection attacks
 */
export function sanitizeForAIPrompt(input: string | undefined | null, maxLength: number = 500): string {
  if (!input) return "No especificado";

  // Remove characters that could break out of prompt context
  let sanitized = input
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove potentially dangerous sequences
    .replace(/[<>{}[\]]/g, '')
    // Remove excessive punctuation that could be used for injection
    .replace(/([!?.]){3,}/g, '$1$1')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Limit length
  sanitized = sanitized.substring(0, maxLength);

  return sanitized || "No especificado";
}

/**
 * Sanitize code input (for procedure codes, etc.)
 * Only allows alphanumeric, hyphens, and underscores
 */
export function sanitizeCode(input: string | undefined | null, maxLength: number = 50): string {
  if (!input) return "";

  // Only keep alphanumeric, hyphens, underscores, and spaces
  const sanitized = input
    .replace(/[^a-zA-Z0-9\-_\s]/g, '')
    .trim()
    .substring(0, maxLength);

  return sanitized;
}

/**
 * Validate and sanitize URL
 * Only allows http/https URLs from trusted domains
 */
export function sanitizeUrl(url: string | undefined | null, allowedDomains?: string[]): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // If allowedDomains specified, check domain
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain =>
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        return null;
      }
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

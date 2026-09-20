/** Normalise an Indian phone number to E.164 (+91…) for Supabase auth. */
export function toE164(raw: string): string | null {
  const cleaned = (raw || "").replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned.length >= 11 ? cleaned : null;
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "+91" + digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  return digits.length >= 10 ? "+" + digits : null;
}

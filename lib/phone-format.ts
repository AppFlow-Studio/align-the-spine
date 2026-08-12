/** Formats a US phone number as-you-type into "(954) 573-7192" — matches
 * lib/lead-form-schema.ts's isValidUsPhone (10 digits, or 11 with a leading
 * country code 1) and enforces the same digit ceiling at the input layer:
 * anything past the 10th/11th digit is silently dropped rather than typed
 * into the field, so a pasted or fat-fingered longer string can't produce a
 * technically-invalid-but-visually-plausible value. */
export function formatUsPhoneAsYouType(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

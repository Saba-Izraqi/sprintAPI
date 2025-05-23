/*
 * Generates a key prefix from a given project name.
 * - Takes the first letter of each word, capitalizes it.
 * - Removes non-alphanumeric characters.
 * - Ensures the result is max 10 characters and starts with a letter.
 * - If the result does not start with a letter, prepends 'P'.
 */
export function generateKeyPrefix(name: string): string {
  if (!name) return "";
  const raw = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase() || "")
    .join("")
    .replace(/[^A-Z0-9]/g, "");

  const prefix = raw.slice(0, 10);
  if (!/^[A-Z]/.test(prefix)) {
    return "P" + prefix.slice(0, 9);
  }

  return prefix;
}

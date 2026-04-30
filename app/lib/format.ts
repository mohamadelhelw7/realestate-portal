/** Format a number with commas. Returns "" for null/undefined/NaN. */
export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US");
}

/** Strip commas from a money input value to get a clean number string. */
export function parseMoney(value: string): string {
  return value.replace(/,/g, "");
}

/** Format payment duration: 36 → "3 years", 6 → "6 months", 30 → "2 years 6 months" */
export function formatDuration(months: number | null | undefined): string {
  if (!months) return "";
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const yearStr = `${years} year${years === 1 ? "" : "s"}`;
  if (remaining === 0) return yearStr;
  return `${yearStr} ${remaining} month${remaining === 1 ? "" : "s"}`;
}

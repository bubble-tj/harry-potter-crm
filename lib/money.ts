export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  return `${sign}$${dollars.toLocaleString()}.${rem.toString().padStart(2, "0")}`;
}

export function parseCents(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return 0;
  const s = String(input).trim().replace(/[$,]/g, "");
  if (!s) return 0;
  const n = Number(s);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

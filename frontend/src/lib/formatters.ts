export function formatINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "₹ 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹ 0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(dateStr: string | Date | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

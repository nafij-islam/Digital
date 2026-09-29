export function formatPrice(
  amount: number,
  currency: string = "৳",
  locale: string = "en-US"
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currency}0`;
  }
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

  return `${currency} ${formatted}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDuration(durationValue: number, durationUnit: string): string {
  if (durationUnit === "lifetime") return "Lifetime Access";
  const unit =
    durationValue === 1
      ? durationUnit.replace(/s$/, "")
      : durationUnit.endsWith("s")
      ? durationUnit
      : `${durationUnit}s`;
  return `${durationValue} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
}

export function maskString(str: string, visibleStart = 4, visibleEnd = 4): string {
  if (!str) return "";
  if (str.length <= visibleStart + visibleEnd) return str;
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  return `${start}${"•".repeat(Math.max(4, str.length - (visibleStart + visibleEnd)))}${end}`;
}

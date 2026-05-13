const vndFormatter = new Intl.NumberFormat("vi-VN");

export function formatVnd(amount) {
  if (amount == null || Number.isNaN(Number(amount))) {
    return "0 vnd";
  }
  return `${vndFormatter.format(Math.round(Number(amount)))} vnd`;
}

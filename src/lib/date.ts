export function getOrdinalSuffix(day: number, includeDay?: boolean) {
  if (typeof day !== "number" || day < 1 || day > 31) {
    throw new Error("Input must be a valid day of the month (1-31).");
  }

  const suffixes = ["th", "st", "nd", "rd"];
  const value = day % 100;

  const ordinalSuffix =
    suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return includeDay ? `${day}${ordinalSuffix}` : ordinalSuffix;
}

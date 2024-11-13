export function utcToKst(utcDate: Date) {
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  return kstDate;
}

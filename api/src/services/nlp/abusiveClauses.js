export async function detectAbusiveClauses(issues) {
  // TODO: implementar heurísticas mais sofisticadas.
  return issues.filter((issue) => issue.type === "clausula_abusiva");
}

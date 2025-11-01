export async function extractDeadlines(text) {
  if (!text) return [];
  // TODO: usar NLP real para normalizar datas.
  const matches = text.match(/\b\d{1,2} dias? úteis?\b/gi) ?? [];
  return matches.map((match, index) => ({
    raw: match,
    normalizedDate: new Date(Date.now() + (index + 3) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    page: index + 1,
    coordinates: null
  }));
}

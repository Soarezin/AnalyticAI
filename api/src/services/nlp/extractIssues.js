import { randomUUID } from "crypto";

export async function extractIssues(text) {
  if (!text) return [];
  // TODO: substituir por heurísticas/LLM reais.
  const sentences = text.split("\n").filter((sentence) => sentence.length > 60);
  return sentences.slice(0, 3).map((sentence, index) => ({
    id: randomUUID(),
    type: ["clausula_abusiva", "prazo_incoerente", "divergencia_dados"][index % 3],
    severity: ["high", "medium", "low"][index % 3],
    page: index + 1,
    textSnippet: sentence.trim().slice(0, 160),
    coordinates: [[120, 450, 600, 492]],
    explanation: "Placeholder: detalhar motivo da flag.",
    rule: "TODO: mapear norma aplicável"
  }));
}

export async function summarizeText(text) {
  // TODO: usar LLM real para gerar resumo jurídico.
  return text?.slice(0, 280) || "Resumo indisponível.";
}

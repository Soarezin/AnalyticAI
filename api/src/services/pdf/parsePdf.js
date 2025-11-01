import pdf from "pdf-parse";

export async function extractText(buffer) {
  const { text, numpages } = await pdf(buffer);
  return {
    text,
    pages: numpages
  };
}

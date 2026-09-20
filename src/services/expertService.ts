import { ContentInputs, GeneratedContent } from "../types";

export async function generateExpertContent(inputs: ContentInputs): Promise<GeneratedContent> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error ||
      `Erro na resposta do servidor (${response.status}: ${response.statusText})`;
    throw new Error(errorMessage);
  }

  const data: GeneratedContent = await response.json();
  return data;
}

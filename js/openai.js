const isValidApiKey = (key) => typeof key === "string" && key.startsWith("sk-");

const defaultTextFromImage = `Você é um assistente de IA que extrai texto de imagens.
Você deve responder apenas com o texto da imagem, sem formatação ou explicações adicionais.
Se o texto apresentar questões e alternativas, retorne apenas as questões que estiverem completas.
Ignore textos que não parecem fazer parte da questões e alternativas.
Se houver mais de uma questão, retorne apenas a primeira.
Se não houver texto na imagem, descreva o que você vê na imagem.`;

async function extractTextFromImage(apiKey, imageBase64, model = "gpt-4o") {
  if (!isValidApiKey(apiKey)) throw new Error("Chave de API inválida");
  if (!imageBase64 || typeof imageBase64 !== "string")
    throw new Error("Imagem inválida");
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      {
        role: "system",
        content: defaultTextFromImage,
      },
      {
        role: "user",
        content: [{ type: "image_url", image_url: { url: imageBase64 } }],
      },
    ],
    max_tokens: 2048,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Erro ao extrair texto da imagem");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function solveOpenAi(
  apiKey,
  model,
  system,
  user,
  temperature,
  maxTokens
) {
  if (!isValidApiKey(apiKey)) throw new Error("Chave de API inválida");
  if (!user || typeof user !== "string")
    throw new Error("Prompt do usuário inválido");
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Erro ao consultar OpenAI");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

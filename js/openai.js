async function extractTextFromImage(apiKey, imageBase64, model = "gpt-4o") {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      {
        role: "system",
        content:
          "Extract and return all text from the image below. Return only the text.",
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

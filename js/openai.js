const isValidApiKey = (key) => typeof key === "string" && key.startsWith("sk-");

const defaultTextFromImage = `You are an AI assistant that extracts text from images.
You must respond only with the text from the image, without formatting or additional explanations.
If the text contains questions and answer options, return only questions that are complete.
Ignore text that does not appear to be part of the questions and options.
If there is more than one question, return only the first one.
If there is no text in the image, describe what you see in the image.`;

async function extractTextFromImage(
  apiKey,
  imageBase64,
  model = "gpt-5.4-mini",
) {
  if (!isValidApiKey(apiKey)) throw new Error("Invalid API key");
  if (!imageBase64 || typeof imageBase64 !== "string")
    throw new Error("Invalid image");
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
  if (!res.ok) throw new Error("Error extracting text from image");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function solveOpenAi(
  apiKey,
  model,
  system,
  user,
  temperature,
  maxTokens,
) {
  if (!isValidApiKey(apiKey)) throw new Error("Invalid API key");
  if (!user || typeof user !== "string") throw new Error("Invalid user prompt");
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
  if (!res.ok) throw new Error("Error querying OpenAI");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

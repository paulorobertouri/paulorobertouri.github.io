const STORAGE_KEY = "openAiKey";
const STORAGE_MODEL = "openAiModel";
const STORAGE_TEMPERATURE = "openAiTemperature";
const STORAGE_MAX_TOKENS = "openAiMaxTokens";

function saveConfig(key, model, temperature, maxTokens) {
  localStorage.setItem(STORAGE_KEY, key);
  localStorage.setItem(STORAGE_MODEL, model);
  localStorage.setItem(STORAGE_TEMPERATURE, temperature);
  localStorage.setItem(STORAGE_MAX_TOKENS, maxTokens);
}

function loadConfig() {
  return {
    key: localStorage.getItem(STORAGE_KEY) || "",
    model: localStorage.getItem(STORAGE_MODEL) || "gpt-4.1-mini",
    temperature: parseFloat(localStorage.getItem(STORAGE_TEMPERATURE)) || 0.7,
    maxTokens: parseInt(localStorage.getItem(STORAGE_MAX_TOKENS), 10) || 4096,
  };
}

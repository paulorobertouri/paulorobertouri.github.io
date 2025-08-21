const STORAGE_KEY = "openAiKey";
const STORAGE_MODEL = "openAiModel";
const STORAGE_TEMPERATURE = "openAiTemperature";
const STORAGE_MAX_TOKENS = "openAiMaxTokens";

/**
 * Save OpenAI configuration securely to localStorage
 * @param {string} key - OpenAI API key
 * @param {string} model - Model name
 * @param {number} temperature - Temperature value
 * @param {number} maxTokens - Max tokens value
 */
const saveConfig = (key, model, temperature, maxTokens) => {
  if (typeof key !== "string" || !key.startsWith("sk-")) return;
  localStorage.setItem(STORAGE_KEY, key);
  localStorage.setItem(STORAGE_MODEL, model);
  localStorage.setItem(STORAGE_TEMPERATURE, String(temperature));
  localStorage.setItem(STORAGE_MAX_TOKENS, String(maxTokens));
};

/**
 * Load OpenAI configuration from localStorage
 * @returns {object} Config object
 */
const loadConfig = () => {
  return {
    key: localStorage.getItem(STORAGE_KEY) || "",
    model: localStorage.getItem(STORAGE_MODEL) || "gpt-5-mini",
    temperature: parseFloat(localStorage.getItem(STORAGE_TEMPERATURE)) || 0.4,
    maxTokens: parseInt(localStorage.getItem(STORAGE_MAX_TOKENS), 10) || 4096,
  };
};

// Export for modularity if using modules (optional)
// export { saveConfig, loadConfig };

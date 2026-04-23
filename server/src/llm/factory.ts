import { LLMProvider } from "./types";
import { GroqProvider } from "./groq.provider";
import { ClaudeProvider } from "./claude.provider";
import { GeminiProvider } from "./gemini.provider"

export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER;

  switch (provider) {
    case "groq":
      return new GroqProvider();
    case "claude":
      return new ClaudeProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error("Invalid LLM_PROVIDER in .env");
  }
}
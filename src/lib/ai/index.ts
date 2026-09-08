import { AIProvider } from "./types";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { NemotronProvider, getNemotronProvider } from "./nemotron";
import { CreativeSynthesisEngine } from "./synthesis-engine";
import { db } from "@/lib/db";

export * from "./types";
export * from "./synthesis-engine";
export * from "./gemini";
export * from "./openai";
export * from "./nemotron";

export async function getAIProviderForOrg(organizationId?: string): Promise<AIProvider> {
  if (organizationId) {
    try {
      const apiKeyRecord = (db as any).apiKeyConfig?.findFirst
        ? await (db as any).apiKeyConfig.findFirst({
            where: { organizationId, isActive: true },
          })
        : null;

      if (apiKeyRecord) {
        if (apiKeyRecord.provider === "GEMINI") {
          return new GeminiProvider(apiKeyRecord.encryptedKey);
        }
        if (apiKeyRecord.provider === "OPENAI") {
          return new OpenAIProvider(apiKeyRecord.encryptedKey);
        }
        if (apiKeyRecord.provider === "NEMOTRON") {
          return new NemotronProvider(apiKeyRecord.encryptedKey);
        }
      }
    } catch {
      // Fallback
    }
  }

  // Check for Nemotron first (new priority)
  const nemotronProvider = getNemotronProvider();
  if (nemotronProvider) {
    return nemotronProvider;
  }

  if (process.env.GEMINI_API_KEY) {
    return new GeminiProvider(process.env.GEMINI_API_KEY);
  }

  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY);
  }

  // Default to native CreativeSynthesisEngine
  return {
    name: "Beyond Creative Engine (v2.6 Pro)",
    generateAd: (input) => CreativeSynthesisEngine.generateAd(input),
    generateBanner: (input) => CreativeSynthesisEngine.generateBanner(input),
    generatePoster: (input) => CreativeSynthesisEngine.generatePoster(input),
    generateVideo: (input) => CreativeSynthesisEngine.generateVideo(input),
    generateCopy: (input) => CreativeSynthesisEngine.generateCopy(input),
  };
}
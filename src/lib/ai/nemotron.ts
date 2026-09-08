import { AIProvider } from "./types";

export class NemotronProvider implements AIProvider {
  name = "Nemotron 3 Ultra";
  private apiKey: string;
  private baseUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateAd(input: any) {
    return this.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert marketing copywriter. Generate compelling ad copy based on the input.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.8,
    });
  }

  async generateBanner(input: any) {
    return this.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert banner designer. Generate banner concepts and copy.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.7,
    });
  }

  async generatePoster(input: any) {
    return this.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert poster designer. Generate poster concepts and copy.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.7,
    });
  }

  async generateVideo(input: any) {
    return this.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert video scriptwriter. Generate video scripts and storyboards.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.8,
    });
  }

  async generateCopy(input: any) {
    return this.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter. Generate high-converting copy.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.7,
    });
  }

  async complete(options: {
    messages: { role: string; content: string }[];
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra",
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: options.stream || false,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Nemotron API error: ${response.status} ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async *streamComplete(options: {
    messages: { role: string; content: string }[];
    temperature?: number;
    maxTokens?: number;
  }) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra",
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Nemotron API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export function getNemotronProvider(): NemotronProvider | null {
  const apiKey = process.env.NEMOTRON_3_ULTRA_API_KEY;
  if (!apiKey || apiKey === "your-nemotron-3-ultra-api-key-here") {
    return null;
  }
  return new NemotronProvider(apiKey);
}
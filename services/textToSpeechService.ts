import { createHash } from "node:crypto";

type CachedSpeech = {
  audio: Uint8Array;
  contentType: string;
  createdAt: number;
};

export type GeneratedSpeech = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  cached: boolean;
};

const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_CONTENT_TYPE = "audio/mpeg";
const CACHE_TTL_MS = 1000 * 60 * 60;
const MAX_CACHE_ITEMS = 50;

const speechCache = new Map<string, CachedSpeech>();

function buildCacheKey(text: string, voiceId: string, modelId: string) {
  return createHash("sha256")
    .update(`${voiceId}:${modelId}:${text}`)
    .digest("hex");
}

function createStreamFromAudio(audio: Uint8Array) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(audio);
      controller.close();
    },
  });
}

function cleanupCache() {
  const now = Date.now();

  for (const [key, value] of speechCache.entries()) {
    if (now - value.createdAt > CACHE_TTL_MS) {
      speechCache.delete(key);
    }
  }

  while (speechCache.size > MAX_CACHE_ITEMS) {
    const oldestKey = speechCache.keys().next().value as string | undefined;
    if (!oldestKey) {
      break;
    }

    speechCache.delete(oldestKey);
  }
}

async function bufferStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    chunks.push(value);
    totalLength += value.length;
  }

  const combined = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined;
}

export class TextToSpeechService {
  private readonly apiKey: string;

  private readonly voiceId: string;

  private readonly modelId: string;

  constructor(options?: {
    apiKey?: string;
    voiceId?: string;
    modelId?: string;
  }) {
    this.apiKey = options?.apiKey || process.env.ELEVENLABS_API_KEY || "";
    this.voiceId =
      options?.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
    this.modelId = options?.modelId || DEFAULT_MODEL_ID;
  }

  async generateSpeech(text: string): Promise<GeneratedSpeech> {
    const normalizedText = text.trim();

    if (!normalizedText) {
      throw new Error("Text is required for speech generation.");
    }

    if (!this.apiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured.");
    }

    cleanupCache();

    const cacheKey = buildCacheKey(
      normalizedText,
      this.voiceId,
      this.modelId
    );
    const cached = speechCache.get(cacheKey);

    if (cached) {
      return {
        body: createStreamFromAudio(cached.audio),
        contentType: cached.contentType,
        cached: true,
      };
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream?output_format=mp3_44100_128&optimize_streaming_latency=2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: DEFAULT_CONTENT_TYPE,
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text: normalizedText,
          model_id: this.modelId,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `ElevenLabs request failed with ${response.status}: ${errorBody.slice(
          0,
          240
        )}`
      );
    }

    if (!response.body) {
      throw new Error("ElevenLabs did not return an audio stream.");
    }

    const contentType =
      response.headers.get("content-type") || DEFAULT_CONTENT_TYPE;
    const [clientStream, cacheStream] = response.body.tee();

    void bufferStream(cacheStream)
      .then((audio) => {
        speechCache.set(cacheKey, {
          audio,
          contentType,
          createdAt: Date.now(),
        });
        cleanupCache();
      })
      .catch((error) => {
        console.warn("Failed to cache ElevenLabs audio", error);
      });

    return {
      body: clientStream,
      contentType,
      cached: false,
    };
  }
}

let textToSpeechServiceSingleton: TextToSpeechService | null = null;

export function getTextToSpeechService() {
  if (!textToSpeechServiceSingleton) {
    textToSpeechServiceSingleton = new TextToSpeechService();
  }

  return textToSpeechServiceSingleton;
}

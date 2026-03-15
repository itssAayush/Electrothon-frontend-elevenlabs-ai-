import { getTextToSpeechService } from "@/services/textToSpeechService";

export const runtime = "nodejs";

const ENABLE_VOICE_ASSISTANT =
  process.env.ENABLE_VOICE_ASSISTANT === "true";
const MAX_TTS_TEXT_LENGTH = 5000;

export async function POST(request: Request) {
  if (!ENABLE_VOICE_ASSISTANT) {
    return new Response(JSON.stringify({ error: "Voice assistant is disabled." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (text.length > MAX_TTS_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Text must be ${MAX_TTS_TEXT_LENGTH} characters or fewer.`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const textToSpeechService = getTextToSpeechService();
    const speech = await textToSpeechService.generateSpeech(text);

    return new Response(speech.body, {
      status: 200,
      headers: {
        "Content-Type": speech.contentType || "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS route failed", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate speech.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

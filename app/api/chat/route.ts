import { GoogleGenerativeAI } from "@google/generative-ai";
import { findSimilarQuestions } from "@/lib/embeddings";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

const SYSTEM_PROMPT = `
You are a highly experienced and compassionate AI Health Assistant for MedConnect.
Your goal is to provide accurate, helpful, and clear information regarding health, symptoms, wellness, and medical procedures.

Guidelines:
1. Always maintain a professional and empathetic tone.
2. Provide information based on general medical knowledge but ALWAYS include a disclaimer that you are an AI and not a replacement for professional medical advice.
3. If a user describes life-threatening symptoms (e.g., severe chest pain, difficulty breathing), urge them to contact emergency services immediately.
4. Use formatting (bullet points, bold text) to make information easy to read.
5. Be concise but thorough.
6. If you are unsure, admit it and suggest consulting a specialist.
`;

type ProviderError = {
  provider: "gemini";
  model: string;
  message: string;
  status?: number;
  code?: string;
};

async function checkForAnswer(_question: string): Promise<string | null> {
  return null;
}

function extractErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      status:
        "status" in error && typeof error.status === "number"
          ? error.status
          : undefined,
      code:
        "code" in error && typeof error.code === "string"
          ? error.code
          : undefined,
    };
  }

  return {
    message: "Unknown provider error",
  };
}

function buildLocalFallback(question: string) {
  const normalizedQuestion = question.toLowerCase();
  const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "trouble breathing",
    "stroke",
    "unconscious",
    "bleeding",
    "seizure",
    "heart attack",
  ];

  const isEmergency = emergencyKeywords.some((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  if (isEmergency) {
    return [
      "**This may be a medical emergency.**",
      "Call your local emergency number or go to the nearest emergency department immediately.",
      "If available, use the hospital finder to identify the nearest hospital while emergency help is on the way.",
      "",
      "_I am an AI assistant and not a substitute for a licensed clinician._",
    ].join("\n");
  }

  return [
    "I'm having trouble reaching the live Gemini provider right now, so I'm switching to a safe fallback response.",
    "",
    "Please share:",
    "- The main symptom or concern",
    "- How long it has been happening",
    "- The age of the patient",
    "- Any severe warning signs such as trouble breathing, chest pain, confusion, or heavy bleeding",
    "",
    "If any severe warning signs are present, seek emergency care immediately.",
    "",
    "_I am an AI assistant and not a substitute for professional medical advice._",
  ].join("\n");
}

async function tryGemini(question: string) {
  if (!genAI) {
    return null;
  }

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Attempting Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(question);
      const response = await result.response;
      const answer = response.text();

      if (answer) {
        return {
          answer,
          modelName,
        };
      }
    } catch (error) {
      const details = extractErrorDetails(error);
      console.error(`Gemini model ${modelName} failed:`, details);
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!question) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const providerErrors: ProviderError[] = [];

    console.log("Processing health query:", question);

    const similarQuestion = await findSimilarQuestions(question);
    if (similarQuestion) {
      console.log("Found cached answer in database");
      return new Response(
        JSON.stringify({
          response: similarQuestion.answer,
          source: "database",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const staffAnswer = await checkForAnswer(question);
    if (staffAnswer) {
      return new Response(
        JSON.stringify({
          response: staffAnswer,
          source: "staff",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (genAI) {
      const geminiResult = await tryGemini(question);
      if (geminiResult?.answer) {
        return new Response(
          JSON.stringify({
            response: geminiResult.answer,
            source: "gemini",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      providerErrors.push({
        provider: "gemini",
        model: GEMINI_MODELS.join(", "),
        message: "All configured Gemini models failed.",
      });
    } else {
      providerErrors.push({
        provider: "gemini",
        model: GEMINI_MODELS.join(", "),
        message: "GEMINI_API_KEY is missing.",
      });
    }

    console.error("Gemini provider failed:", providerErrors);

    return new Response(
      JSON.stringify({
        response: buildLocalFallback(question),
        source: "system",
        warning: "Gemini is unavailable. Using a local fallback.",
        providerErrors,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Critical Chat Route Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        response:
          "I couldn't process that message. Please try again with a shorter description of the symptoms or concern.",
        source: "system",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

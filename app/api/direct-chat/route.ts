/**
 * Direct Chat API Route
 *
 * POST /api/direct-chat — Create a new support chat session.
 * GET /api/direct-chat — Fetch chat messages for a session.
 *
 * TODO: Migrate to Firebase/Firestore.
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Direct chat request:", { userId, message });

    // TODO: Migrate to Firebase/Firestore
    // Previously created a direct_chats record and chat_messages in Supabase
    return NextResponse.json(
      {
        message:
          "Direct chat is being migrated to Firebase. Please try again later.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Error in direct chat route:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const chatId = url.searchParams.get("chatId");
    const userId = url.searchParams.get("userId");

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // TODO: Migrate to Firebase/Firestore
    // Previously queried chat_messages from Supabase
    return NextResponse.json(
      {
        messages: [],
        notice: "Direct chat is being migrated to Firebase.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

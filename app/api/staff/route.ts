/**
 * Staff Management API Route
 *
 * POST /api/staff — Add a user as a staff member.
 * TODO: Migrate to Firebase/Firestore for staff management.
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // TODO: Migrate staff member management to Firebase
    // Previously used Supabase auth admin API to look up users by email
    // and insert into staff_members table.
    console.warn("Staff API: Firebase migration pending. Email:", email);

    return NextResponse.json(
      {
        message:
          "Staff management is being migrated to Firebase. Please try again later.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

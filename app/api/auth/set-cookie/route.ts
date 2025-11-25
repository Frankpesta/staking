import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API route to set httpOnly auth cookie
 * This is more secure than setting cookies from client-side
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Set httpOnly cookie (more secure)
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}

/**
 * API route to clear auth cookie
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear cookie" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { render } from "@react-email/render";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Truststaking <notifications@notifications.truststaking.live>";

export async function POST(request: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { email, verificationLink } = await request.json();

    if (!email || !verificationLink) {
      return NextResponse.json(
        { error: "Email and verification link are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Validate verification link is a valid URL
    try {
      new URL(verificationLink);
    } catch {
      return NextResponse.json(
        { error: "Invalid verification link format" },
        { status: 400 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const emailHtml = await render(
      WelcomeEmail({
        userEmail: email,
        verificationLink,
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email.trim(),
      subject: "Welcome to Truststaking - Verify your email",
      html: emailHtml,
    });

    // Check if Resend returned an error in the response
    if (result.error) {
      console.error(`[Verification Email] Resend API error for ${email}:`, result.error);
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: result.error.message || String(result.error),
        },
        { status: 500 }
      );
    }

    // Resend returns { data: { id: string } } on success
    console.log(`[Verification Email] Successfully sent to ${email}`, result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

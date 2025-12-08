"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { EmailVerifiedEmail } from "@/emails/email-verified";
import { render as renderEmail } from "@react-email/render";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Truststaking <notifications@truststaking.live>";

// Only initialize Resend if API key is available
let resend: Resend | null = null;
let render: typeof renderEmail | null = null;

if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY);
    render = renderEmail;
  } catch (error) {
    console.warn("Email dependencies not available:", error);
  }
}

/**
 * Send welcome email with verification link
 */
export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    verificationLink: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if Resend is configured
    if (!RESEND_API_KEY) {
      console.error("[Email Error] RESEND_API_KEY is not set in environment variables");
      return { success: false, error: "RESEND_API_KEY not configured", skipped: true };
    }

    // If Resend is not initialized, log and return error
    if (!resend || !render) {
      console.error(`[Email Error] Resend not initialized. API Key present: ${!!RESEND_API_KEY}`);
      console.error(`[Email Error] Would send to: ${args.email}`);
      console.error(`[Email Error] Verification link: ${args.verificationLink}`);
      return { success: false, error: "Resend not initialized", skipped: true };
    }

    try {
      console.log(`[Email] Attempting to send welcome email to ${args.email}`);
      console.log(`[Email] From: ${FROM_EMAIL}`);
      
      const emailHtml = await render(
        WelcomeEmail({
          userEmail: args.email,
          verificationLink: args.verificationLink,
        })
      );
      
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject: "Welcome to Truststaking - Verify your email",
        html: emailHtml,
      });
      
      console.log(`[Email] Successfully sent welcome email to ${args.email}`, result);
      return { success: true, result };
    } catch (error) {
      console.error("[Email Error] Failed to send welcome email:", error);
      console.error("[Email Error] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        email: args.email,
        from: FROM_EMAIL,
      });
      // Don't throw - allow signup to continue even if email fails
      return { success: false, error: String(error) };
    }
  },
});

/**
 * Send email verified confirmation
 */
export const sendEmailVerifiedEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // If Resend is not configured, log and return success (email sending disabled)
    if (!resend || !render) {
      console.log(`[Email Disabled] Email verified confirmation would be sent to ${args.email}`);
      return { success: true, skipped: true };
    }

    try {
      const emailHtml = await render(EmailVerifiedEmail());
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject: "Email verified - Welcome to Truststaking",
        html: emailHtml,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send email verified email:", error);
      // Don't throw - this is not critical
      return { success: false };
    }
  },
});


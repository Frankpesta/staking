"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { EmailVerifiedEmail } from "@/emails/email-verified";
import { render as renderEmail } from "@react-email/render";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Truststaking <noreply@truststaking.com>";

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
    // If Resend is not configured, log and return success (email sending disabled)
    if (!resend || !render) {
      console.log(`[Email Disabled] Welcome email would be sent to ${args.email}`);
      console.log(`[Email Disabled] Verification link: ${args.verificationLink}`);
      return { success: true, skipped: true };
    }

    try {
      const emailHtml = await render(
        WelcomeEmail({
          userEmail: args.email,
          verificationLink: args.verificationLink,
        })
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject: "Welcome to Truststaking - Verify your email",
        html: emailHtml,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
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


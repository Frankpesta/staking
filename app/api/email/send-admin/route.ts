import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Truststaking <notifications@notifications.truststaking.live>";

export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admins can send emails
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    
    if (!decoded || decoded.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const recipientType = formData.get("recipientType") as string; // "all" or "single"
    const recipientEmail = formData.get("recipientEmail") as string | null;
    const recipientEmails = formData.get("recipientEmails") as string | null; // JSON array for bulk
    const attachments = formData.getAll("attachments") as File[];

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    if (recipientType === "single" && !recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required for single email" },
        { status: 400 }
      );
    }

    if (recipientType === "all" && !recipientEmails) {
      return NextResponse.json(
        { error: "Recipient emails are required for bulk email" },
        { status: 400 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    // Process attachments (only if files are provided)
    // Limit file size to 10MB per file
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const validAttachments = attachments.filter(
      (file) => file && file.size > 0 && file.size <= MAX_FILE_SIZE
    );
    
    if (attachments.some((file) => file && file.size > MAX_FILE_SIZE)) {
      return NextResponse.json(
        { error: "One or more files exceed the 10MB size limit" },
        { status: 400 }
      );
    }

    const processedAttachments = validAttachments.length > 0
      ? await Promise.all(
          validAttachments.map(async (file) => {
            try {
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              return {
                filename: file.name,
                content: buffer,
              };
            } catch (error) {
              console.error(`Failed to process attachment ${file.name}:`, error);
              return null;
            }
          })
        ).then((results) => results.filter((r): r is NonNullable<typeof r> => r !== null))
      : [];

    // Determine recipients
    let recipients: string[] = [];
    if (recipientType === "single") {
      if (!recipientEmail || !recipientEmail.includes("@") || !recipientEmail.includes(".")) {
        return NextResponse.json(
          { error: "Invalid recipient email address" },
          { status: 400 }
        );
      }
      recipients = [recipientEmail.trim()];
    } else {
      try {
        recipients = JSON.parse(recipientEmails!);
        if (!Array.isArray(recipients)) {
          return NextResponse.json(
            { error: "Invalid recipient emails format - must be an array" },
            { status: 400 }
          );
        }
        if (recipients.length === 0) {
          return NextResponse.json(
            { error: "No recipients found for bulk email" },
            { status: 400 }
          );
        }
        // Validate all emails
        const invalidEmails = recipients.filter(
          (email) => !email || typeof email !== "string" || !email.includes("@") || !email.includes(".")
        );
        if (invalidEmails.length > 0) {
          return NextResponse.json(
            { error: `Invalid email addresses found: ${invalidEmails.slice(0, 5).join(", ")}${invalidEmails.length > 5 ? ` and ${invalidEmails.length - 5} more` : ""}` },
            { status: 400 }
          );
        }
        
        // Trim and deduplicate emails
        recipients = [...new Set(recipients.map((email) => email.trim()))];
      } catch (parseError) {
        return NextResponse.json(
          { error: "Invalid recipient emails format - must be valid JSON" },
          { status: 400 }
        );
      }
    }

    // Send emails (limit to prevent abuse)
    if (recipients.length > 1000) {
      return NextResponse.json(
        { error: "Cannot send to more than 1000 recipients at once" },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No valid recipients found" },
        { status: 400 }
      );
    }

    // Send emails with rate limiting (batch of 10 at a time to avoid overwhelming Resend)
    const BATCH_SIZE = 10;
    const results: PromiseSettledResult<any>[] = [];
    
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((email) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: email.trim(),
            subject: subject.trim(),
            html: body,
            attachments: processedAttachments.length > 0 ? processedAttachments : undefined,
          }).catch((error) => {
            // Resend throws errors, so we catch and return them
            console.error(`[Admin Email] Failed to send to ${email}:`, error);
            throw error;
          })
        )
      );
      results.push(...batchResults);
      
      // Small delay between batches to avoid rate limiting (100ms)
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    
    // Log failed emails for debugging
    if (failed > 0) {
      const failedResults = results
        .map((r, index) => ({ result: r, email: recipients[index] }))
        .filter(({ result }) => result.status === "rejected");
      console.error(`[Admin Email] Failed to send to ${failed} recipients:`, 
        failedResults.slice(0, 5).map(({ email, result }) => ({
          email,
          reason: result.status === "rejected" ? result.reason : "unknown"
        }))
      );
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: recipients.length,
    });
  } catch (error) {
    console.error("Failed to send admin email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

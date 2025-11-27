import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { EmailVerifiedEmail } from "@/emails/email-verified";
import { DepositApprovedEmail } from "@/emails/deposit-approved";
import { WithdrawalProcessedEmail } from "@/emails/withdrawal-processed";
import { StakeMaturedEmail } from "@/emails/stake-matured";
import { KYCApprovedEmail } from "@/emails/kyc-approved";
import { KYCRejectedEmail } from "@/emails/kyc-rejected";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Truststaking <noreply@truststaking.com>";

export async function sendWelcomeEmail(
  to: string,
  verificationLink: string
) {
  try {
    const emailHtml = await render(WelcomeEmail({ userEmail: to, verificationLink }));
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Truststaking - Verify your email",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendEmailVerifiedEmail(to: string) {
  try {
    const emailHtml = await render(EmailVerifiedEmail());
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Email verified - Welcome to Truststaking",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send email verified email:", error);
  }
}

export async function sendDepositApprovedEmail(
  to: string,
  amount: number,
  coin: string,
  txHash?: string,
  explorerUrl?: string
) {
  try {
    const emailHtml = await render(
      DepositApprovedEmail({ amount, coin, txHash, explorerUrl })
    );
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Deposit approved - ${amount} ${coin} credited`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send deposit approved email:", error);
  }
}

export async function sendWithdrawalProcessedEmail(
  to: string,
  amount: number,
  coin: string,
  txHash: string,
  explorerUrl: string,
  walletAddress: string
) {
  try {
    const emailHtml = await render(
      WithdrawalProcessedEmail({
        amount,
        coin,
        txHash,
        explorerUrl,
        walletAddress,
      })
    );
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Withdrawal processed - ${amount} ${coin}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send withdrawal processed email:", error);
  }
}

export async function sendStakeMaturedEmail(
  to: string,
  principal: number,
  roi: number,
  totalAmount: number,
  coin: string,
  duration: number
) {
  try {
    const emailHtml = await render(
      StakeMaturedEmail({ principal, roi, totalAmount, coin, duration })
    );
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Staking pool matured - ${totalAmount} ${coin} released`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send stake matured email:", error);
  }
}

export async function sendKYCApprovedEmail(to: string) {
  try {
    const emailHtml = await render(KYCApprovedEmail());
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "KYC verification approved",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send KYC approved email:", error);
  }
}

export async function sendKYCRejectedEmail(
  to: string,
  rejectionReason: string
) {
  try {
    const emailHtml = await render(KYCRejectedEmail({ rejectionReason }));
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "KYC verification requires attention",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send KYC rejected email:", error);
  }
}


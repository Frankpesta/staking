import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coins, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Truststaking",
  description: "Terms of Service for Truststaking crypto staking platform",
} as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Truststaking</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              By accessing and using Truststaking (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Truststaking is a cryptocurrency staking platform that allows users to stake their digital assets across multiple blockchain networks. Our Platform provides:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Multi-chain staking services</li>
              <li>Fixed return on investment (ROI) based on staking duration</li>
              <li>Deposit and withdrawal services</li>
              <li>Coin swap functionality</li>
              <li>KYC verification services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. User Accounts</h2>
            <h3 className="mb-3 text-xl font-semibold">3.1 Account Creation</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              To use our Platform, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <h3 className="mb-3 text-xl font-semibold">3.2 Account Security</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You agree to immediately notify us of any unauthorized use of your account or any other breach of security. We are not liable for any loss or damage arising from your failure to protect your account information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Staking Services</h2>
            <h3 className="mb-3 text-xl font-semibold">4.1 Staking Terms</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              When you stake assets on our Platform, you agree to the specific terms of the staking pool, including:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Staking duration (30, 60, 90, 180, or 365 days)</li>
              <li>Fixed ROI percentage based on duration</li>
              <li>Lock-in period restrictions</li>
              <li>Maturation terms</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">4.2 Returns</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              ROI percentages are fixed at the time of staking and are based on the selected duration. Returns are calculated and distributed according to the terms of each staking pool. We reserve the right to adjust ROI rates for new staking pools but will honor existing commitments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Deposits and Withdrawals</h2>
            <h3 className="mb-3 text-xl font-semibold">5.1 Deposits</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Deposits require on-chain transactions to our platform wallets. All deposits are subject to admin approval and may take time to process. Minimum deposit amounts vary by coin and are displayed on the Platform.
            </p>
            <h3 className="mb-3 text-xl font-semibold">5.2 Withdrawals</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Withdrawal requests are processed on-chain and require admin approval. Processing times may vary. Withdrawals are subject to minimum amounts and may incur network fees. We reserve the right to delay or refuse withdrawals for security or compliance reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. KYC and Compliance</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We may require Know Your Customer (KYC) verification for certain services or transactions. You agree to provide accurate identification documents and information when requested. Failure to complete KYC may result in restricted access to Platform features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Fees</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Our Platform may charge fees for certain services, including but not limited to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Network fees for on-chain transactions</li>
              <li>Swap fees for coin conversions</li>
              <li>Withdrawal processing fees</li>
            </ul>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              All fees are clearly displayed before you confirm any transaction. You are responsible for all fees associated with your use of the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Risks and Disclaimers</h2>
            <h3 className="mb-3 text-xl font-semibold">8.1 Cryptocurrency Risks</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Cryptocurrency investments carry inherent risks, including but not limited to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Market volatility</li>
              <li>Regulatory changes</li>
              <li>Technology risks</li>
              <li>Potential loss of funds</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">8.2 No Investment Advice</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Our Platform does not provide investment, financial, or trading advice. All staking decisions are made at your own risk. You should consult with qualified financial advisors before making investment decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Prohibited Activities</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You agree not to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Use the Platform for illegal activities</li>
              <li>Attempt to hack, disrupt, or interfere with the Platform</li>
              <li>Use automated systems to access the Platform without authorization</li>
              <li>Provide false or misleading information</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Limitation of Liability</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              To the maximum extent permitted by law, Truststaking and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Termination</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary. You may terminate your account at any time by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Changes to Terms</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We reserve the right to modify these Terms at any time. Material changes will be notified via email or Platform notification. Continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">13. Governing Law</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">14. Contact Information</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              If you have questions about these Terms, please contact us through our support system or email support@truststaking.com.
            </p>
          </section>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button size="lg">Return to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}


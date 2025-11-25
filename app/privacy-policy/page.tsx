import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coins, ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Truststaking",
  description: "Privacy Policy for Truststaking crypto staking platform",
} as const;

export default function PrivacyPolicyPage() {
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
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Truststaking (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency staking platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
            <h3 className="mb-3 text-xl font-semibold">2.1 Personal Information</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Email address</li>
              <li>Password (stored as encrypted hash)</li>
              <li>KYC documents and verification information</li>
              <li>Wallet addresses</li>
              <li>Support ticket information</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">2.2 Transaction Information</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We collect information about your transactions on our Platform, including:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Deposit and withdrawal amounts</li>
              <li>Staking activities and balances</li>
              <li>Swap transactions</li>
              <li>Transaction timestamps and status</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">2.3 Technical Information</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We automatically collect certain technical information, including:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Session tokens and authentication data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our Platform services</li>
              <li>Process transactions and manage your account</li>
              <li>Verify your identity for KYC compliance</li>
              <li>Send you important updates and notifications</li>
              <li>Respond to your support requests</li>
              <li>Detect and prevent fraud or security threats</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
            <h3 className="mb-3 text-xl font-semibold">4.1 We Do Not Sell Your Data</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
            <h3 className="mb-3 text-xl font-semibold">4.2 Service Providers</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We may share your information with trusted service providers who assist us in operating our Platform, including:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Cloud hosting and infrastructure providers</li>
              <li>Email service providers</li>
              <li>KYC verification services</li>
              <li>Blockchain network providers</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">4.3 Legal Requirements</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We may disclose your information if required by law, court order, or governmental authority, or to protect our rights, property, or safety, or that of our users.
            </p>
            <h3 className="mb-3 text-xl font-semibold">4.4 Business Transfers</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Encryption of sensitive data at rest and in transit</li>
              <li>Secure password hashing (bcrypt with salt rounds)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure session management</li>
            </ul>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Data Retention</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain security and prevent fraud</li>
            </ul>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Transaction records and activity logs are retained for audit and compliance purposes. You may request deletion of your account, subject to legal retention requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Your Rights and Choices</h2>
            <h3 className="mb-3 text-xl font-semibold">7.1 Access and Correction</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You have the right to access, update, or correct your personal information through your account settings or by contacting support.
            </p>
            <h3 className="mb-3 text-xl font-semibold">7.2 Data Portability</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You may request a copy of your personal data in a structured, machine-readable format.
            </p>
            <h3 className="mb-3 text-xl font-semibold">7.3 Deletion</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You may request deletion of your account and personal information, subject to legal and regulatory retention requirements.
            </p>
            <h3 className="mb-3 text-xl font-semibold">7.4 Opt-Out</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You can opt out of non-essential communications by adjusting your notification preferences in your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Cookies and Tracking Technologies</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Maintain your session and authentication state</li>
              <li>Remember your preferences</li>
              <li>Analyze Platform usage</li>
              <li>Improve security</li>
            </ul>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You can control cookies through your browser settings, but disabling cookies may affect Platform functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Third-Party Links</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Children&apos;s Privacy</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Our Platform is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. International Data Transfers</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. Material changes will be notified via email or Platform notification. Your continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">13. Contact Us</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Email: privacy@truststaking.com</li>
              <li>Support: support@truststaking.com</li>
              <li>Through our Platform support system</li>
            </ul>
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


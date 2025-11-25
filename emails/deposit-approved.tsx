import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DepositApprovedEmailProps {
  amount: number;
  coin: string;
  txHash?: string;
  explorerUrl?: string;
}

export const DepositApprovedEmail = ({
  amount,
  coin,
  txHash,
  explorerUrl,
}: DepositApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your deposit has been approved and credited</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Deposit Approved!</Heading>
          <Text style={text}>
            Great news! Your deposit has been approved and credited to your account.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Amount:</Text>
            <Text style={infoValue}>
              {amount.toFixed(6)} {coin}
            </Text>
          </Section>
          {txHash && (
            <>
              <Text style={text}>
                Transaction Hash: <code style={code}>{txHash}</code>
              </Text>
              {explorerUrl && (
                <Section style={buttonContainer}>
                  <Link style={button} href={explorerUrl}>
                    View on Blockchain Explorer
                  </Link>
                </Section>
              )}
            </>
          )}
          <Text style={text}>
            You can now use these funds for staking, swapping, or withdrawals.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href="https://truststaking.com/dashboard">
              Go to Dashboard
            </Link>
          </Section>
          <Text style={text}>
            Best regards,
            <br />
            The Truststaking Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const infoBox = {
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  padding: "20px",
  margin: "20px 0",
};

const infoLabel = {
  color: "#666",
  fontSize: "14px",
  margin: "0 0 5px 0",
};

const infoValue = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const code = {
  backgroundColor: "#f4f4f4",
  padding: "2px 6px",
  borderRadius: "3px",
  fontFamily: "monospace",
  fontSize: "14px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
};


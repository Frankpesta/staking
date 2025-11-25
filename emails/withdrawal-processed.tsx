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

interface WithdrawalProcessedEmailProps {
  amount: number;
  coin: string;
  txHash: string;
  explorerUrl: string;
  walletAddress: string;
}

export const WithdrawalProcessedEmail = ({
  amount,
  coin,
  txHash,
  explorerUrl,
  walletAddress,
}: WithdrawalProcessedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your withdrawal has been processed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Withdrawal Processed!</Heading>
          <Text style={text}>
            Your withdrawal request has been processed and sent to your wallet.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Amount:</Text>
            <Text style={infoValue}>
              {amount.toFixed(6)} {coin}
            </Text>
            <Text style={infoLabel}>To Address:</Text>
            <Text style={code}>{walletAddress}</Text>
            <Text style={infoLabel}>Transaction Hash:</Text>
            <Text style={code}>{txHash}</Text>
          </Section>
          <Section style={buttonContainer}>
            <Link style={button} href={explorerUrl}>
              View Transaction on Explorer
            </Link>
          </Section>
          <Text style={text}>
            The funds should arrive in your wallet shortly. If you have any questions, please contact support.
          </Text>
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
  margin: "10px 0 5px 0",
};

const infoValue = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const code = {
  backgroundColor: "#ffffff",
  padding: "2px 6px",
  borderRadius: "3px",
  fontFamily: "monospace",
  fontSize: "12px",
  wordBreak: "break-all" as const,
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


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

export const KYCApprovedEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Your KYC verification has been approved</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>KYC Verification Approved! ✅</Heading>
          <Text style={text}>
            Great news! Your identity verification has been approved.
          </Text>
          <Text style={text}>
            You now have full access to all platform features, including:
          </Text>
          <Section style={list}>
            <Text style={listItem}>✓ Increased deposit and withdrawal limits</Text>
            <Text style={listItem}>✓ Access to all staking options</Text>
            <Text style={listItem}>✓ Priority support</Text>
            <Text style={listItem}>✓ Enhanced security features</Text>
          </Section>
          <Section style={buttonContainer}>
            <Link style={button} href="https://truststaking.com/dashboard">
              Go to Dashboard
            </Link>
          </Section>
          <Text style={text}>
            Thank you for completing the verification process.
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

const list = {
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  padding: "20px",
  margin: "20px 0",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "5px 0",
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


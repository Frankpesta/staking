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

interface WelcomeEmailProps {
  userEmail: string;
  verificationLink: string;
}

export const WelcomeEmail = ({ userEmail, verificationLink }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Truststaking - Verify your email to get started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Truststaking!</Heading>
          <Text style={text}>
            Hi there,
          </Text>
          <Text style={text}>
            Thank you for signing up for Truststaking. We&apos;re excited to have you on board!
          </Text>
          <Text style={text}>
            To get started, please verify your email address by clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={verificationLink}>
              Verify Email Address
            </Link>
          </Section>
          <Text style={text}>
            If the button doesn&apos;t work, copy and paste this link into your browser:
          </Text>
          <Text style={link}>{verificationLink}</Text>
          <Text style={text}>
            This link will expire in 24 hours.
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

export default WelcomeEmail;

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

const link = {
  color: "#2754C5",
  textDecoration: "underline",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};


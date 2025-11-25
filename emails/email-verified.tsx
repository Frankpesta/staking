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

export const EmailVerifiedEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Your email has been verified successfully</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Email Verified!</Heading>
          <Text style={text}>
            Congratulations! Your email address has been successfully verified.
          </Text>
          <Text style={text}>
            You can now access all features of Truststaking. Complete your KYC verification to unlock additional benefits and increase your limits.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href="https://truststaking.com/dashboard/kyc">
              Complete KYC Verification
            </Link>
          </Section>
          <Text style={text}>
            If you have any questions, feel free to contact our support team.
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


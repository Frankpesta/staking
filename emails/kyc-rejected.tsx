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

interface KYCRejectedEmailProps {
  rejectionReason: string;
}

export const KYCRejectedEmail = ({ rejectionReason }: KYCRejectedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>KYC verification requires attention</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>KYC Verification Update</Heading>
          <Text style={text}>
            We&apos;ve reviewed your KYC submission, but unfortunately, we need some additional information.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Reason:</Text>
            <Text style={infoText}>{rejectionReason}</Text>
          </Section>
          <Text style={text}>
            Please review your documents and resubmit with the necessary corrections. Make sure all documents are:
          </Text>
          <Section style={list}>
            <Text style={listItem}>• Clear and readable</Text>
            <Text style={listItem}>• Valid and not expired</Text>
            <Text style={listItem}>• Properly formatted (JPG, PNG, or PDF)</Text>
            <Text style={listItem}>• Under 5MB in size</Text>
          </Section>
          <Section style={buttonContainer}>
            <Link style={button} href="https://truststaking.com/dashboard/kyc">
              Resubmit KYC Documents
            </Link>
          </Section>
          <Text style={text}>
            If you have any questions, please contact our support team.
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
  backgroundColor: "#fff3cd",
  borderLeft: "4px solid #ffc107",
  borderRadius: "5px",
  padding: "20px",
  margin: "20px 0",
};

const infoLabel = {
  color: "#856404",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const infoText = {
  color: "#856404",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
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


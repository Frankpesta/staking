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

interface StakeMaturedEmailProps {
  principal: number;
  roi: number;
  totalAmount: number;
  coin: string;
  duration: number;
}

export const StakeMaturedEmail = ({
  principal,
  roi,
  totalAmount,
  coin,
  duration,
}: StakeMaturedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your staking pool has matured</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Staking Pool Matured! 🎉</Heading>
          <Text style={text}>
            Congratulations! Your {duration}-day staking pool has matured and your funds have been released.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Principal:</Text>
            <Text style={infoValue}>
              {principal.toFixed(6)} {coin}
            </Text>
            <Text style={infoLabel}>ROI Earned:</Text>
            <Text style={infoValue}>
              +{roi.toFixed(6)} {coin}
            </Text>
            <Text style={infoLabel}>Total Return:</Text>
            <Text style={totalValue}>
              {totalAmount.toFixed(6)} {coin}
            </Text>
          </Section>
          <Text style={text}>
            Your funds have been added to your available balance. You can now stake again, withdraw, or swap your coins.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href="https://truststaking.com/dashboard/staking">
              Stake Again
            </Link>
          </Section>
          <Text style={text}>
            Thank you for staking with Truststaking!
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
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
};

const totalValue = {
  color: "#22c55e",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "10px 0 0 0",
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


import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

interface DutyNotificationEmailProps {
  engineerName: string;
  dutyDate: string;
  dutyDay: string;
  monthYear: string;
}

export const DutyNotificationEmail = ({
  engineerName,
  dutyDate,
  dutyDay,
  monthYear,
}: DutyNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Deployment Duty Notification for {dutyDate}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Deployment Duty Notification</Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Hi <strong>{engineerName}</strong>,
          </Text>
          <Text style={paragraph}>
            This is a reminder that you are on deployment duty for:
          </Text>
          <Section style={dutyBox}>
            <Text style={dutyLabel}>Date:</Text>
            <Text style={dutyValue}>{dutyDate}</Text>
            <Text style={dutyLabel}>Day:</Text>
            <Text style={dutyValue}>{dutyDay}</Text>
            <Text style={dutyLabel}>Month:</Text>
            <Text style={dutyValue}>{monthYear}</Text>
          </Section>
          <Text style={paragraph}>
            Please ensure you are available for any deployment requests and
            critical issues that may arise during this period.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This is an automated notification from DeployRoster.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DutyNotificationEmail;

const main = {
  backgroundColor: "#f4f4f4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
  color: "#1f2937",
};

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "20px 0",
};

const dutyBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "4px",
  padding: "16px",
  margin: "16px 0",
};

const dutyLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "8px 0 4px 0",
};

const dutyValue = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 16px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

import { Resend } from "resend";
import { DutyNotificationEmail } from "@/emails/duty-notification";
import { NextRequest, NextResponse } from "next/server";
import { render } from "react-email";

interface SendEmailRequest {
  engineerName: string;
  engineerEmail: string;
  dutyDate: string;
  dutyDay: string;
  monthYear: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = (await request.json()) as SendEmailRequest;
    const {
      engineerName,
      engineerEmail,
      dutyDate,
      dutyDay,
      monthYear,
    } = body;

    // Validate required fields
    if (
      !engineerName ||
      !engineerEmail ||
      !dutyDate ||
      !dutyDay ||
      !monthYear
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(engineerEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log(`[v0] Rendering email for ${engineerName} (${engineerEmail})`);
    const emailHtml = await render(
      DutyNotificationEmail({
        engineerName,
        dutyDate,
        dutyDay,
        monthYear,
      })
    );

    console.log(`[v0] Sending email via Resend to ${engineerEmail}`);
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: engineerEmail,
      subject: `Deployment Duty Notification - ${dutyDate}`,
      html: emailHtml,
    });

    if (response.error) {
      console.error("[v0] Resend error:", response.error);
      return NextResponse.json(
        { error: `Failed to send email: ${response.error.message}` },
        { status: 500 }
      );
    }

    console.log(`[v0] Email sent successfully to ${engineerEmail} with ID: ${response.data?.id}`);
    return NextResponse.json(
      {
        success: true,
        message: `Email sent to ${engineerEmail}`,
        id: response.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Error sending email:", errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

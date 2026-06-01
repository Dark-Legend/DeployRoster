import { Resend } from "resend";
import { DutyNotificationEmail } from "@/emails/duty-notification";
import { NextRequest, NextResponse } from "next/server";
import { render } from "react-email";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

interface SendEmailRequest {
  engineerName: string;
  engineerEmail: string;
  dutyDate: string;
  dutyDay: string;
  monthYear: string;
}

export async function POST(request: NextRequest) {
  try {
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

    const emailHtml = await render(
      DutyNotificationEmail({
        engineerName,
        dutyDate,
        dutyDay,
        monthYear,
      })
    );

    const response = await resend.emails.send({
      from: "noreply@deployroster.dev",
      to: engineerEmail,
      subject: `Deployment Duty Notification - ${dutyDate}`,
      html: emailHtml,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Email sent to ${engineerEmail}`,
        id: response.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

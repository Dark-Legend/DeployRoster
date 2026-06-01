import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is coming from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      process.env.CRON_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current date in IST (UTC+5:30)
    const now = new Date();
    const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const todayISO = istDate.toISOString().split("T")[0];

    console.log(`[v0] Cron job running at ${now.toISOString()}`);
    console.log(`[v0] IST Date: ${todayISO}`);

    const emailsSent: string[] = [];
    const emailsFailed: string[] = [];

    // Since localStorage is client-side only, server-side cron jobs need a database.
    // In production, integrate with your database to:
    // 1. Fetch all active rosters
    // 2. Find entries matching today's date
    // 3. Send emails to assigned engineers using Resend

    console.log(
      "[v0] Cron job: To fully implement, connect to a database to fetch active rosters"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Cron job executed successfully",
        emailsSent,
        emailsFailed,
        note: "For production use, store roster data in a database instead of localStorage",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to execute cron job" },
      { status: 500 }
    );
  }
}

/**
 * PRODUCTION IMPLEMENTATION EXAMPLE
 *
 * This is how you would implement the cron job with a real database (Neon, Supabase, etc.):
 *
 * import { render } from "react-email";
 * import { Resend } from "resend";
 * import { DutyNotificationEmail } from "@/emails/duty-notification";
 *
 * const resend = new Resend(process.env.RESEND_API_KEY);
 * const MONTHS = ["January", "February", "March", "April", "May", "June",
 *   "July", "August", "September", "October", "November", "December"];
 *
 * export async function GET(request: NextRequest) {
 *   try {
 *     const authHeader = request.headers.get("authorization");
 *     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
 *       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *     }
 *
 *     const now = new Date();
 *     const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
 *     const todayISO = istDate.toISOString().split("T")[0];
 *
 *     // Query your database for roster entries matching today's date
 *     const todaysEntries = await db.query(
 *       "SELECT * FROM roster_entries WHERE isoDate = $1",
 *       [todayISO]
 *     );
 *
 *     const emailsSent: string[] = [];
 *     const emailsFailed: string[] = [];
 *
 *     for (const entry of todaysEntries) {
 *       const engineer = await db.query(
 *         "SELECT * FROM employees WHERE name = $1 AND email IS NOT NULL",
 *         [entry.engineer]
 *       );
 *
 *       if (engineer?.email) {
 *         const emailHtml = render(
 *           DutyNotificationEmail({
 *             engineerName: engineer.name,
 *             dutyDate: entry.date,
 *             dutyDay: entry.day,
 *             monthYear: `${MONTHS[entry.month]} ${entry.year}`,
 *           })
 *         );
 *
 *         const response = await resend.emails.send({
 *           from: "noreply@deployroster.dev",
 *           to: engineer.email,
 *           subject: `Deployment Duty Notification - ${entry.date}`,
 *           html: emailHtml,
 *         });
 *
 *         if (!response.error) {
 *           emailsSent.push(engineer.email);
 *         } else {
 *           emailsFailed.push(engineer.email);
 *         }
 *       }
 *     }
 *
 *     return NextResponse.json({
 *       success: true,
 *       message: `Sent ${emailsSent.length} emails, ${emailsFailed.length} failed`,
 *       emailsSent,
 *       emailsFailed,
 *     });
 *   } catch (error) {
 *     console.error("[v0] Cron job error:", error);
 *     return NextResponse.json(
 *       { error: "Failed to execute cron job" },
 *       { status: 500 }
 *     );
 *   }
 * }
 */

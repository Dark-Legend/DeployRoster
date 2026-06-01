# DeployRoster - Next.js Deployment & Email Setup Guide

## What's New

Your DeployRoster app has been successfully converted to **Next.js 16** with full email automation capabilities:

### ✅ Completed Features

1. **Next.js 16 Conversion**
   - Migrated from Vite React to Next.js App Router
   - All components and state management preserved
   - Improved performance with server components and streaming

2. **Manual Email Sending**
   - Email icon button in each roster entry (in the "ROSTER DETAILS" table)
   - Click to send deployment duty notification to assigned engineer
   - Confirmation dialog before sending
   - Uses Resend email service

3. **Automated Scheduled Emails**
   - Cron job configured to run daily at 6 PM IST
   - Automatically sends duty notification to engineer on duty
   - Configured in `vercel.json`

4. **Professional Email Templates**
   - Beautiful React Email templates
   - Includes duty date, day of week, and engineer details
   - Dark theme matching app design

## Setup Instructions

### 1. Get Resend API Key

1. Go to https://resend.com
2. Sign up and create account
3. Copy your API key

### 2. Set Environment Variables

**For local development:**
Create `.env.local`:
```
RESEND_API_KEY=your_api_key_here
CRON_SECRET=your_secret_here
```

**For Vercel deployment:**
1. Go to Vercel project settings
2. Add these variables under "Environment Variables":
   - `RESEND_API_KEY`: Your Resend API key
   - `CRON_SECRET`: Any random secret string for security

### 3. Deploy to Vercel

```bash
git push origin email-automation-and-sending
```

Or connect your GitHub repo to Vercel and it will auto-deploy.

## How to Use

### Manual Email Sending

1. Generate a roster (add engineers, select month, click "Generate Roster")
2. Scroll down to "ROSTER DETAILS" table
3. Click the **email icon** next to any engineer's duty date
4. Confirm the action in the dialog
5. Email sent! (Requires Resend API key configured)

### Automatic Email Sending

Once deployed to Vercel with cron configured:
- Every day at 6 PM IST, an email is automatically sent
- The email goes to the engineer assigned for that day
- No manual action needed!

## API Routes

### POST `/api/send-email`
Sends a manual email notification.

**Required body:**
```json
{
  "engineerName": "John Doe",
  "engineerEmail": "john@example.com",
  "dutyDate": "2024-06-01",
  "dutyDay": "Saturday",
  "monthYear": "June 2024"
}
```

### GET `/api/cron/send-duty-emails`
Scheduled cron endpoint (6 PM IST daily).
Requires `CRON_SECRET` authorization header.

## File Structure

```
app/
├── layout.tsx              # Root layout with Providers
├── page.tsx               # Home page
├── providers.tsx          # Client-side providers (Toaster, TooltipProvider)
├── api/
│   ├── send-email/       # Manual email API
│   └── cron/
│       └── send-duty-emails/  # Scheduled email endpoint
└── not-found.tsx

emails/
└── duty-notification.tsx   # React Email template

.env.example               # Environment variables template
vercel.json               # Vercel cron configuration
```

## Next Steps (Optional Enhancements)

### Store Rosters in Database
Currently rosters are stored in localStorage. For production with reliable scheduled emails:

1. Connect to Neon, Supabase, or similar
2. Update cron job to query database for active rosters
3. Store roster creation time for better tracking

### Add OAuth / Social Login
Update Better Auth configuration to add Google, GitHub, etc.

### Schedule Emails at Different Times
Edit `vercel.json` - change the `schedule` field:
- `"0 12 * * *"` = 12:00 UTC (12:30 PM IST)
- `"30 12 * * *"` = 12:30 UTC (6 PM IST)

### Email Customization
Edit `/emails/duty-notification.tsx` to customize the email design and content.

## Troubleshooting

### Emails not sending?
1. Check if `RESEND_API_KEY` is set
2. Verify engineer email addresses are configured
3. Check Resend dashboard for delivery status

### Cron job not running?
1. Verify `CRON_SECRET` is set in Vercel
2. Check Vercel function logs
3. Ensure `vercel.json` is committed and deployed

### Local development issues?
Run `npm run dev` - it will hot-reload as you make changes.

## Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Email Service](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [React Email](https://react.email)

## Support

For issues with the original app features, check the main README.md
For email-specific questions, refer to Resend documentation.

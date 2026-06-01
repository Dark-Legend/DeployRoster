# DeployRoster

A deployment duty scheduling application built with **Next.js 16**, **TypeScript**, **React 19**, and **Tailwind CSS**. Create, manage, and share deployment duty rosters with your team, plus send automated email notifications.

## Features

- 🗓️ **Generate Rosters** - Automatically create deployment duty schedules
- 📧 **Email Notifications** - Send manual emails to assigned engineers with deployment duty details
- ⏰ **Scheduled Emails** - Automatic emails sent daily at 6 PM IST to the engineer on duty
- 🔄 **Swap Engineers** - Drag-and-drop engineer assignments in the calendar
- 📤 **Export to PDF** - Download rosters as PDF documents
- 🔗 **Share Links** - Generate shareable links to view rosters
- 🎨 **Modern UI** - Beautiful, responsive design with dark theme
- ♿ **Accessible** - Built with accessibility best practices

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Resend account for email functionality

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dark-Legend/DeployRoster.git
cd DeployRoster
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Resend API key:
```
RESEND_API_KEY=your_resend_api_key_here
CRON_SECRET=your_cron_secret_here
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
npm start
```

## Email Features

### Manual Email Sending

- Click the **email icon** next to any engineer's entry in the roster table
- Confirm the action in the dialog
- The engineer will receive a formatted duty notification email

**Requirements:**
- Engineer must have an email address configured
- Resend API key must be set in environment variables

### Automatic Scheduled Emails (6 PM IST)

- Configure the cron job in `vercel.json` (currently set to 12:00 UTC = 5:30 PM IST)
- **Note:** For production, connect to a database to store active rosters
- Currently uses localStorage (client-side), suitable for local/demo use

**To adjust the cron time:**
Edit the `schedule` field in `vercel.json`. Currently: `"0 12 * * *"` (12:00 UTC)
- 6 PM IST = 12:30 PM UTC → use `"30 12 * * *"`

### Cron Job Configuration

The cron job endpoint is available at `/api/cron/send-duty-emails`. Configure it in Vercel:

1. Set `CRON_SECRET` in Vercel environment variables
2. Add the cron configuration to `vercel.json`
3. Deploy to Vercel for scheduled emails to work

## Project Structure

```
DeployRoster/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── roster/[id]/page.tsx     # Roster view page
│   ├── not-found.tsx            # 404 page
│   └── api/
│       ├── send-email/route.ts  # Manual email API
│       └── cron/
│           └── send-duty-emails/route.ts  # Scheduled email endpoint
├── src/
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand store (state management)
│   ├── utils/                   # Utility functions
│   └── lib/                     # Library utilities
├── emails/                       # React Email templates
├── public/                       # Static files
├── vercel.json                  # Vercel configuration & cron schedule
└── .env.example                 # Environment variables template
```

## API Routes

### POST `/api/send-email`

Send a duty notification email to an engineer.

**Request Body:**
```json
{
  "engineerName": "John Doe",
  "engineerEmail": "john@example.com",
  "dutyDate": "2024-06-01",
  "dutyDay": "Saturday",
  "monthYear": "June 2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent to john@example.com",
  "id": "email_id_from_resend"
}
```

### GET `/api/cron/send-duty-emails`

Scheduled cron job that runs daily to send emails to the engineer on duty. Requires `CRON_SECRET` for authorization.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand
- **Email:** Resend, React Email
- **PDF Generation:** PDF-Lib
- **UI Components:** Radix UI, Lucide Icons

## Database Integration

Currently, the app uses localStorage for client-side data persistence. For production with automatic scheduled emails:

1. **Recommended:** Integrate with Neon PostgreSQL or Supabase
2. Update the cron job to query the database
3. Store roster data server-side for reliable scheduled email delivery

See the example implementation comments in `/app/api/cron/send-duty-emails/route.ts`.

## Deployment

Deploy to Vercel for full functionality including scheduled cron jobs:

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `RESEND_API_KEY`
   - `CRON_SECRET`
4. Deploy - cron jobs will automatically run on schedule

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.

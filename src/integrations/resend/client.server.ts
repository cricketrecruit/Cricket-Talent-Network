// Server-side Resend email sender. Server-only: reads RESEND_API_KEY from process.env.
// Load inside server handlers: const { sendEmail } = await import("@/integrations/resend/client.server");
// Top-level import is safe only in other .server.ts modules - route files and *.functions.ts ship to the client bundle.

interface SendEmailInput {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("[Resend] Missing RESEND_API_KEY environment variable. Set it in .env (see .env.example) or your deployment environment variables.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Cricket Recruit <notifications@noreply.cricketrecruit.com>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Resend] Failed to send email (${res.status}): ${body}`);
  }
}

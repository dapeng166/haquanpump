import { NextResponse } from "next/server";
import { company } from "@/lib/site";

// Basic server-side validation + email delivery for the contact form.
// If RESEND_API_KEY is set, the inquiry is emailed via Resend's HTTP API
// (no SDK dependency). Otherwise it is logged and still returns success so the
// form works in development. Swap in your own SMTP/CRM here if preferred.

interface InquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 422 });
  }

  const to = process.env.INQUIRY_TO_EMAIL || company.salesEmail;
  const from = process.env.INQUIRY_FROM_EMAIL || "sales@haquanpump.com";
  const apiKey = process.env.RESEND_API_KEY;

  const text = [
    `New website inquiry from ${name}`,
    `Email: ${email}`,
    `Phone: ${body.phone || "—"}`,
    `Company: ${body.company || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Haquan Website <${from}>`,
          to: [to],
          reply_to: email,
          subject: `Inquiry from ${name}${body.company ? ` (${body.company})` : ""}`,
          text,
        }),
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
    }
  } else {
    // No provider configured — log so nothing is lost in development.
    console.info("[inquiry] (no RESEND_API_KEY set)\n" + text);
  }

  return NextResponse.json({ ok: true });
}

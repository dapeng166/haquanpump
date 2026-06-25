import { NextResponse } from "next/server";
import { company, WP_API_URL } from "@/lib/site";

// Delivers a contact-form / product inquiry so it is NEVER lost:
//   1. Primary  — stored in WordPress (visible under wp-admin → Inquiries) via
//      the Haquan — Inquiries plugin, which also emails sales@haquanpump.com.
//   2. Fallback — if WordPress is unreachable and RESEND_API_KEY is set, the
//      inquiry is emailed via Resend instead.
// If neither channel accepts the message we return an error (no silent drops),
// so the form can tell the visitor to email us directly.

interface InquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  product?: string;
  message?: string;
  website?: string; // honeypot — bots fill it, humans never do
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot tripped → accept silently so the bot moves on, but store nothing.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const phone = body.phone?.trim() || "";
  const companyName = body.company?.trim() || "";
  const product = body.product?.trim() || "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 422 });
  }

  const payload = { name, email, phone, company: companyName, product, message };

  // 1) Primary channel — store in WordPress (and it emails staff via wp_mail).
  let delivered = false;
  try {
    const res = await fetch(`${WP_API_URL}/haquan/v1/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (res.ok) delivered = true;
  } catch {
    // fall through to the email fallback
  }

  // 2) Fallback channel — Resend email, only if WordPress did not accept it.
  if (!delivered) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.INQUIRY_TO_EMAIL || company.salesEmail;
    const from = process.env.INQUIRY_FROM_EMAIL || "sales@haquanpump.com";
    const text = [
      `New website inquiry from ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      `Company: ${companyName || "—"}`,
      `Product: ${product || "—"}`,
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
            subject: `Inquiry from ${name}${companyName ? ` (${companyName})` : ""}`,
            text,
          }),
        });
        if (res.ok) delivered = true;
      } catch {
        // handled below
      }
    }

    if (!delivered) {
      // Nothing accepted the message — log the full content so it is recoverable
      // from server logs, and signal failure so the UI can offer a direct email.
      console.error("[inquiry] DELIVERY FAILED — message not stored:\n" + text);
      return NextResponse.json(
        { ok: false, error: "Delivery failed. Please email us directly." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

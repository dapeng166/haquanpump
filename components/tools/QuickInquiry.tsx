"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

/**
 * Inline inquiry shown when nothing in the range fits, so the visitor can send
 * the duty point without leaving the tool. Posts to the same /api/inquiry as
 * the contact form (stored in WordPress, emailed to sales@).
 */
export function QuickInquiry({ product }: { product: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  // Keep the message in step with the duty point until the visitor edits it.
  const [edited, setEdited] = useState(false);
  useEffect(() => {
    if (!edited) setMessage(`Please recommend a pump for: ${product.replace(/^Pump selector: /, "")}`);
  }, [product, edited]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, product }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Thank you, your request has been sent.</p>
          <p className="mt-1 text-sm">Our engineers will reply by email, usually within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-6 hover:shadow-sm">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">Ask our engineers</h2>
        <p className="mt-1 text-sm text-slate-600">
          We can often build a pump for duties outside our standard ranges. Send your figures and we
          will reply with a recommendation.
        </p>
      </div>
      {/* Honeypot — hidden from people; bots that fill it are rejected server-side. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="qi-website">Leave this field empty</label>
        <input id="qi-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name <span className="text-accent">*</span>
          <input name="name" required autoComplete="name" className={`${inputCls} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email <span className="text-accent">*</span>
          <input name="email" type="email" required autoComplete="email" className={`${inputCls} mt-1.5`} />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Message <span className="text-accent">*</span>
        <textarea
          name="message"
          required
          rows={3}
          value={message}
          onChange={(e) => {
            setEdited(true);
            setMessage(e.target.value);
          }}
          className={`${inputCls} mt-1.5`}
        />
      </label>
      {status === "error" ? (
        <p className="text-sm text-red-600">
          Sorry, the request could not be sent. Please email us at sales@haquanpump.com.
        </p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className="btn-primary">
        {status === "sending" ? "Sending…" : "Send request"}
        <Send className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}

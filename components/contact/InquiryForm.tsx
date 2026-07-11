"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { company } from "@/lib/site";
import { useTranslation } from "@/lib/i18n/I18nProvider";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Optional translated strings. English routes omit this (labels come from the
 * `t()` dictionary, which renders English); localized `/[locale]/contact` pages
 * pass server-translated values so the whole form reads in the visitor's
 * language. `{product}` in `prefill` is substituted with the product name.
 */
export type InquiryFormLabels = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  successTitle: string;
  success: string;
  sendAnother: string;
  error: string;
  agree: string;
  privacyPolicy: string;
  prefill: string;
};

export function InquiryForm({ labels }: { labels?: InquiryFormLabels }) {
  const { t } = useTranslation();
  // Prefer server-translated labels on localized pages; fall back to the
  // English dictionary (`t`) / English defaults on the root route.
  const L = {
    name: labels?.name ?? t("form.name"),
    email: labels?.email ?? t("form.email"),
    phone: labels?.phone ?? t("form.phone"),
    company: labels?.company ?? t("form.company"),
    message: labels?.message ?? t("form.message"),
    messagePlaceholder:
      labels?.messagePlaceholder ?? "Flow rate (m³/h), head (m), medium, power supply…",
    send: labels?.send ?? t("form.send"),
    sending: labels?.sending ?? t("form.sending"),
    successTitle: labels?.successTitle ?? "Inquiry Sent",
    success: labels?.success ?? t("form.success"),
    sendAnother: labels?.sendAnother ?? "Send another inquiry",
    error: labels?.error ?? t("form.error"),
    agree: labels?.agree ?? "By submitting you agree to our",
    privacyPolicy: labels?.privacyPolicy ?? "Privacy Policy",
  };
  const params = useSearchParams();
  const product = params.get("product");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Pre-fill the message when arriving from a product "Inquire" button.
  useEffect(() => {
    if (product) {
      const template =
        labels?.prefill ??
        "I would like a quotation for: {product}.\n\nMy application / duty point: ";
      setMessage(template.replace("{product}", product));
    }
  }, [product, labels]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/[0.06] p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden />
        <h3 className="mt-4 font-display text-xl font-bold text-slate-900">{L.successTitle}</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">{L.success}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6"
        >
          {L.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Carries the product name when arriving from a product "Inquire" button. */}
      <input type="hidden" name="product" value={product ?? ""} />
      {/* Honeypot — hidden from people; bots that fill it are rejected server-side. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={L.name} name="name" type="text" required autoComplete="name" />
        <Field label={L.email} name="email" type="email" required autoComplete="email" />
        <Field label={L.phone} name="phone" type="tel" autoComplete="tel" />
        <Field label={L.company} name="company" type="text" autoComplete="organization" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
          {L.message} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={L.messagePlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {status === "error" && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            {L.error}{" "}
            <a href={`mailto:${company.email}`} className="font-semibold underline">
              {company.email}
            </a>
          </span>
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? L.sending : L.send}
        <Send className="h-4 w-4 rtl-flip" aria-hidden />
      </button>
      <p className="text-xs text-slate-400">
        {L.agree}{" "}
        <Link href="/privacy-policy" className="underline hover:text-accent-600">
          {L.privacyPolicy}
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

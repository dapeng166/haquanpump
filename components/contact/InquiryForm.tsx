"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useTranslation } from "@/lib/i18n/I18nProvider";

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const product = params.get("product");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Pre-fill the message when arriving from a product "Inquire" button.
  useEffect(() => {
    if (product) {
      setMessage(`I would like a quotation for: ${product}.\n\nMy application / duty point: `);
    }
  }, [product]);

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
        <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Inquiry Sent</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">{t("form.success")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("form.name")} name="name" type="text" required autoComplete="name" />
        <Field label={t("form.email")} name="email" type="email" required autoComplete="email" />
        <Field label={t("form.phone")} name="phone" type="tel" autoComplete="tel" />
        <Field label={t("form.company")} name="company" type="text" autoComplete="organization" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
          {t("form.message")} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Flow rate (m³/h), head (m), medium, power supply…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> {t("form.error")}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? t("form.sending") : t("form.send")}
        <Send className="h-4 w-4 rtl-flip" aria-hidden />
      </button>
      <p className="text-xs text-slate-400">
        By submitting you agree to our{" "}
        <Link href="/privacy-policy" className="underline hover:text-accent-600">
          Privacy Policy
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

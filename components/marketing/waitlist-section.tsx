"use client";

import { useState } from "react";

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-slate-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Stop paying for invoice errors
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          Request a demo to see how CostGuard can protect your bottom line.
        </p>

        {submitted ? (
          <div className="mx-auto mt-10 max-w-sm rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
            <svg
              className="mx-auto h-12 w-12 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold text-white">You&apos;re on the list!</p>
            <p className="mt-2 text-sm text-slate-300">
              We&apos;ll reach out within 24 hours to schedule your demo.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="cta-email" className="sr-only">
              Work email
            </label>
            <input
              id="cta-email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting…" : "Request Demo"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate-400">
          No commitment required. We&apos;ll show you exactly how it works.
        </p>
      </div>
    </section>
  );
}

// Keep export alias for backwards compatibility
export { CtaSection as WaitlistSection };

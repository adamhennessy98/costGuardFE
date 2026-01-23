export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pb-24 pt-20 sm:pt-28 lg:pb-32">
      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Now in private beta
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Catch costly satisfation{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                before you pay
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0 mx-auto">
              AI-powered invoice analysis for finance teams. Detect overcharges, duplicates, and anomalies automatically—so you pay with confidence.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center">
              <a
                href="#waitlist"
                className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Request Demo
              </a>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span>See how it works</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Trust badges */}
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 lg:justify-start" aria-label="Trust indicators">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2-minute setup</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SOC 2 in progress</span>
              </li>
            </ul>
          </div>

          {/* Right: Floating UI mock cards */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-8 -top-8 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />
            
            {/* Main card */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" aria-hidden="true">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Invoice Analysis</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Live</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm text-slate-600">INV-2024-0892</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Valid</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                  <span className="text-sm text-slate-600">INV-2024-0893</span>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Duplicate</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                  <span className="text-sm text-slate-600">INV-2024-0894</span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Review</span>
                </div>
              </div>
            </div>

            {/* Floating badge card */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100" aria-hidden="true">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Anomalies Detected</p>
                  <p className="text-lg font-bold text-slate-900">23</p>
                </div>
              </div>
            </div>

            {/* Floating savings card */}
            <div className="absolute -right-4 bottom-8 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100" aria-hidden="true">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Saved This Month</p>
                  <p className="text-lg font-bold text-emerald-600">$12,450</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

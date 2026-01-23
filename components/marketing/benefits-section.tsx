const benefits = [
  {
    title: "Reduce Financial Risk",
    description:
      "Catch duplicate invoices, inflated charges, and suspicious patterns before they hit your bank account.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Save Review Time",
    description:
      "Automated anomaly detection replaces hours of manual spreadsheet review with instant AI-powered analysis.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Improve Audit Readiness",
    description:
      "Every invoice review is logged with timestamps and decision rationale. Export compliance reports instantly.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
      </svg>
    ),
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Outcomes
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Features translate to real business value
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CostGuard doesn&apos;t just find problems—it protects your bottom line and frees your team to focus on strategic work.
            </p>
            <div className="mt-10 space-y-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual placeholder */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-100" />
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Monthly Savings</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">+24%</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Duplicates Caught</span>
                    <span className="font-medium text-gray-900">$8,420</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 w-3/4 rounded-full bg-indigo-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overcharges Flagged</span>
                    <span className="font-medium text-gray-900">$3,150</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 w-1/2 rounded-full bg-violet-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Hours Saved</span>
                    <span className="font-medium text-gray-900">42 hrs</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

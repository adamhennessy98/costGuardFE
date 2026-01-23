const metrics = [
  {
    value: "4.2%",
    label: "Suspicious invoices flagged",
    description: "Average across all customers",
  },
  {
    value: "$2.4M",
    label: "Value protected",
    description: "Cumulative savings identified",
  },
  {
    value: "85%",
    label: "Time saved",
    description: "Reduction in manual review hours",
  },
];

export function MetricsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Results
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by finance teams
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Early results from our beta program
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center"
            >
              <div className="text-5xl font-bold text-indigo-600">
                {metric.value}
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-900">
                {metric.label}
              </p>
              <p className="mt-1 text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

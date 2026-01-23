const testimonials = [
  {
    quote:
      "CostGuard caught a duplicate invoice we'd been paying for six months. That single find paid for the entire year.",
    author: "Sarah Chen",
    role: "CFO",
    company: "Riverstone Construction",
    avatar: "SC",
  },
  {
    quote:
      "We process 500+ invoices a month. Manual review was killing us. Now our team focuses on exceptions only.",
    author: "Marcus Johnson",
    role: "AP Manager",
    company: "Precision Manufacturing",
    avatar: "MJ",
  },
  {
    quote:
      "The audit trail alone is worth it. When vendors push back, we have the data to back up our questions.",
    author: "Emily Rodriguez",
    role: "Controller",
    company: "Greenleaf Medical Group",
    avatar: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Testimonials
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by finance professionals
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <svg
                className="h-8 w-8 text-indigo-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mt-4 flex-1 text-gray-700">
                {testimonial.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600" aria-hidden="true">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

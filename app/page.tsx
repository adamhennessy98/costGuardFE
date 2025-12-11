import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to costGuard
        </h1>
        <p className="text-base text-foreground/70 sm:text-lg">
          Use the navigation to explore dashboards, upload new invoices, review
          flagged items, or drill into invoice details.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="/dashboard">View Dashboard</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/upload">Upload Invoices</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="/flagged-invoices">Review Flagged</a>
        </Button>
      </div>
    </section>
  );
}

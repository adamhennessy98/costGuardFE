import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center bg-gradient-to-br from-background via-background to-background">
        <Container className="py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center sm:items-start sm:text-left">
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground/70">
              costGuard
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Build your cost visibility experience from a clean slate.
              </h1>
              <p className="text-lg text-foreground/70">
                Start prototyping dashboards, alerts, and workflows without
                wading through template code. This skeleton keeps the
                essentials so you can ship features faster.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button>Get Started</Button>
              <Button variant="ghost" className="sm:ml-2">
                View Docs
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

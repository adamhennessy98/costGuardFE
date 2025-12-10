import Link from "next/link";

import { Container } from "@/components/layout/container";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          costGuard
        </Link>
        <nav className="flex items-center gap-4 text-sm text-foreground/70">
          <Link className="transition hover:text-foreground" href="#features">
            Features
          </Link>
          <Link className="transition hover:text-foreground" href="#pricing">
            Pricing
          </Link>
          <Link className="transition hover:text-foreground" href="#contact">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  );
}

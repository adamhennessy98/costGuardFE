'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/flagged-invoices", label: "Flagged Invoices" },
  { href: "/invoices", label: "Invoices" },
];

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    if (!pathname) return NAV_ITEMS[0]?.href ?? "/";
    const match = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
    return match?.href ?? NAV_ITEMS[0]?.href ?? "/";
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 flex-col border-r border-border bg-muted/40 lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6 text-lg font-semibold">
          costGuard
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
          <div className="flex flex-1 items-center justify-between">
            <span className="text-base font-semibold">costGuard</span>
            <nav className="flex items-center gap-4 text-sm text-foreground/70">
              {NAV_ITEMS.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition hover:text-foreground",
                      isActive && "text-foreground font-semibold",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

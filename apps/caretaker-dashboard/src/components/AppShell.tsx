"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, cn } from "@coco/ui";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
];

type AppShellProps = {
  caregiverName: string;
  children: React.ReactNode;
};

export function AppShell({ caregiverName, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-[color-mix(in_srgb,var(--color-primary)_12%,white)] text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] px-4 py-6 md:flex">
        <div className="mb-8 px-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Coco
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Caregiver
          </p>
        </div>
        {nav}
        <div className="mt-auto space-y-3 border-t border-[var(--color-border)] pt-4">
          <p className="px-3 text-sm font-medium text-[var(--color-foreground)]">
            {caregiverName}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={signOut}
            disabled={signingOut}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Coco
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {caregiverName}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </header>

        {open ? (
          <div className="border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
            {nav}
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start"
              onClick={signOut}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

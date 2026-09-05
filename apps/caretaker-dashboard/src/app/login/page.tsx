import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@coco/ui";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--color-primary)_10%,transparent),_transparent_55%)]"
      />
      <Card className="relative w-full max-w-md border-[var(--color-border)] shadow-none">
        <CardHeader className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Coco
          </p>
          <CardTitle className="text-2xl">Caregiver sign in</CardTitle>
          <CardDescription>
            Monitor cognitive activity and reminders for patients in your care.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-[var(--color-muted-foreground)]">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { AlertStrip, PatientCard } from "@/components/PatientCard";
import { getCaregiverMe, loadPatientOverviews } from "@/server/caregiver-api";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function OverviewPage() {
  const [caregiver, items] = await Promise.all([
    getCaregiverMe(),
    loadPatientOverviews(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {greeting()}, {caregiver.full_name.split(" ")[0]}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
          Patient care overview
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-muted-foreground)]">
          Cognitive activity, reminders, and early decline signals for patients
          under your care.
        </p>
      </header>

      <AlertStrip items={items} />

      {items.length === 0 ? (
        <EmptyState
          title="No patients yet"
          description="Add a patient to start tracking games, reminders, and cognitive progress."
          action={
            <Link
              href="/patients"
              className="inline-flex h-11 min-h-[44px] cursor-pointer items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              Go to patients
            </Link>
          }
        />
      ) : (
        <section aria-label="Patients">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
              {items.length} patient{items.length === 1 ? "" : "s"}
            </h2>
            <Link
              href="/patients"
              className="text-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <PatientCard key={item.patient.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@coco/ui";
import { AlertTriangle } from "lucide-react";

import type { PatientOverview } from "@/server/caregiver-api";

export function AlertStrip({
  items,
}: {
  items: PatientOverview[];
}) {
  const alerts = items.filter((i) => i.ai?.analytics.decline_alert);
  if (alerts.length === 0) return null;

  return (
    <section
      aria-label="Decline alerts"
      className="rounded-xl border border-[color-mix(in_srgb,var(--color-warning)_35%,white)] bg-[color-mix(in_srgb,var(--color-warning)_8%,white)] px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--color-warning)]">
            Attention needed
          </p>
          <ul className="mt-2 space-y-1.5">
            {alerts.map(({ patient, ai }) => (
              <li key={patient.id} className="text-sm text-[var(--color-ink)]">
                <Link
                  href={`/patients/${patient.id}`}
                  className="font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  {patient.full_name}
                </Link>
                <span className="text-[var(--color-muted-foreground)]">
                  {" "}
                  — trend {ai?.analytics.overall_trend ?? "declining"}
                  {ai?.analytics.weakest_domain
                    ? ` · weakest: ${(ai.analytics.weakest_domain ?? "").replace(/_/g, " ")}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <span
          role="status"
          aria-atomic="true"
          className="sr-only"
        >
          {alerts.length} patient
          {alerts.length === 1 ? "" : "s"} with decline alerts
        </span>
      </div>
    </section>
  );
}

export function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-mist)] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--color-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function PatientCard({ item }: { item: PatientOverview }) {
  const { patient, progress, ai } = item;
  const decline = Boolean(ai?.analytics.decline_alert);

  return (
    <Link href={`/patients/${patient.id}`} className="group block">
      <Card className="h-full transition-shadow duration-200 group-hover:shadow-md group-focus-within:ring-2 group-focus-within:ring-[var(--color-ring)]">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{patient.full_name}</CardTitle>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              {patient.region ?? "North East India"} · Level{" "}
              {patient.cognitive_level}
            </p>
          </div>
          {decline ? (
            <Badge variant="warning">Decline alert</Badge>
          ) : (
            <Badge variant="success">Stable</Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <MetricTile
              label="Sessions"
              value={progress?.total_sessions ?? "—"}
            />
            <MetricTile
              label="Avg score"
              value={
                progress ? Math.round(progress.average_score) : "—"
              }
            />
            <MetricTile
              label="Streak"
              value={progress ? `${progress.streak_days}d` : "—"}
            />
          </div>
          {ai?.difficulty.reason ? (
            <p className="mt-4 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
              {ai.difficulty.reason}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

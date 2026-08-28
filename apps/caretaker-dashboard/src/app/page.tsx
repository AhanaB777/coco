import type { HealthResponse } from "@coco/shared-types";
import { Button } from "@coco/ui";

async function getHealth(): Promise<HealthResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/health`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="border-b border-emerald-200 bg-white px-8 py-6">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Coco · Caretaker Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-emerald-950">
          Patient care overview
        </h1>
        <p className="mt-2 max-w-2xl text-emerald-800">
          Monitor cognitive game activity, reminders, and progress for patients
          under your care in North East India.
        </p>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-8 py-10 md:grid-cols-2">
        <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-950">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>View patients</Button>
            <Button variant="outline">Reminder alerts</Button>
          </div>
        </section>

        <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-950">API status</h2>
          {health ? (
            <dl className="mt-4 space-y-2 text-sm text-emerald-900">
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-700">Service</dt>
                <dd className="font-medium">{health.service}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-700">Status</dt>
                <dd className="font-medium text-emerald-700">{health.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-700">Checked at</dt>
                <dd className="font-medium">
                  {new Date(health.timestamp).toLocaleString()}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-amber-800">
              Backend unreachable. Start it with{" "}
              <code className="rounded bg-emerald-100 px-1.5 py-0.5">
                pnpm dev:backend
              </code>
              .
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

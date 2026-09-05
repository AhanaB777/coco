import { redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { getCaregiverMe } from "@/server/caregiver-api";
import { ApiError } from "@/server/server-api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let caregiver;
  try {
    caregiver = await getCaregiverMe();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return <AppShell caregiverName={caregiver.full_name}>{children}</AppShell>;
}

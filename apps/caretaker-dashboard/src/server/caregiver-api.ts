import type {
  AISummaryResponse,
  GameSession,
  Patient,
  PatientCreate,
  ProgressMetrics,
  Reminder,
  ReminderCreate,
  ReminderUpdate,
  UserResponse,
} from "@coco/shared-types";

import { apiFetch } from "./server-api";

export function getCaregiverMe() {
  return apiFetch<UserResponse>("/api/v1/caregivers/me");
}

export function listPatients() {
  return apiFetch<Patient[]>("/api/v1/patients/");
}

export function getPatient(id: string) {
  return apiFetch<Patient>(`/api/v1/patients/${id}`);
}

export function createPatient(payload: PatientCreate) {
  return apiFetch<Patient>("/api/v1/patients/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProgress(patientId: string) {
  return apiFetch<ProgressMetrics>(`/api/v1/progress/${patientId}`);
}

export function getAiSummary(patientId: string) {
  return apiFetch<AISummaryResponse>(`/api/v1/games/ai-summary/${patientId}`);
}

export function listSessions(patientId: string) {
  return apiFetch<GameSession[]>(
    `/api/v1/games/sessions?patient_id=${encodeURIComponent(patientId)}`
  );
}

export function listReminders(patientId: string) {
  return apiFetch<Reminder[]>(
    `/api/v1/reminders/?patient_id=${encodeURIComponent(patientId)}`
  );
}

export function createReminder(payload: ReminderCreate) {
  return apiFetch<Reminder>("/api/v1/reminders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateReminder(id: string, payload: ReminderUpdate) {
  return apiFetch<Reminder>(`/api/v1/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteReminder(id: string) {
  return apiFetch<void>(`/api/v1/reminders/${id}`, {
    method: "DELETE",
  });
}

export type PatientOverview = {
  patient: Patient;
  progress: ProgressMetrics | null;
  ai: AISummaryResponse | null;
};

export async function loadPatientOverviews(): Promise<PatientOverview[]> {
  const patients = await listPatients();
  return Promise.all(
    patients.map(async (patient) => {
      const [progress, ai] = await Promise.all([
        getProgress(patient.id).catch(() => null),
        getAiSummary(patient.id).catch(() => null),
      ]);
      return { patient, progress, ai };
    })
  );
}

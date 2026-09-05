"use server";

import { revalidatePath } from "next/cache";

import type {
  PatientCreate,
  ReminderCreate,
  ReminderUpdate,
} from "@coco/shared-types";

import {
  createPatient,
  createReminder,
  deleteReminder,
  updateReminder,
} from "@/server/caregiver-api";
import { ApiError } from "@/server/server-api";

function rethrow(err: unknown): never {
  if (err instanceof ApiError) {
    throw new Error(err.message);
  }
  throw err instanceof Error ? err : new Error("Something went wrong");
}

export async function createPatientAction(payload: PatientCreate) {
  try {
    const patient = await createPatient(payload);
    revalidatePath("/");
    revalidatePath("/patients");
    return patient;
  } catch (err) {
    rethrow(err);
  }
}

export async function createReminderAction(payload: ReminderCreate) {
  try {
    const reminder = await createReminder(payload);
    revalidatePath(`/patients/${payload.patient_id}`);
    return reminder;
  } catch (err) {
    rethrow(err);
  }
}

export async function updateReminderAction(
  id: string,
  patientId: string,
  payload: ReminderUpdate
) {
  try {
    const reminder = await updateReminder(id, payload);
    revalidatePath(`/patients/${patientId}`);
    return reminder;
  } catch (err) {
    rethrow(err);
  }
}

export async function deleteReminderAction(id: string, patientId: string) {
  try {
    await deleteReminder(id);
    revalidatePath(`/patients/${patientId}`);
  } catch (err) {
    rethrow(err);
  }
}

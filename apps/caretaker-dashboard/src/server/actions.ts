"use server";

import { revalidatePath } from "next/cache";

import type {
  AlertUpdate,
  PatientCreate,
  ReminderCreate,
  ReminderUpdate,
} from "@coco/shared-types";

import {
  createPatient,
  createReminder,
  deleteReminder,
  updateAlert,
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
    revalidatePath("/alerts");
    revalidatePath("/");
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
    revalidatePath("/alerts");
    revalidatePath("/");
    return reminder;
  } catch (err) {
    rethrow(err);
  }
}

export async function deleteReminderAction(id: string, patientId: string) {
  try {
    await deleteReminder(id);
    revalidatePath(`/patients/${patientId}`);
    revalidatePath("/alerts");
    revalidatePath("/");
  } catch (err) {
    rethrow(err);
  }
}

export async function updateAlertAction(id: string, payload: AlertUpdate) {
  try {
    const alert = await updateAlert(id, payload);
    revalidatePath("/alerts");
    revalidatePath("/");
    if (alert.patient_id) {
      revalidatePath(`/patients/${alert.patient_id}`);
    }
    return alert;
  } catch (err) {
    rethrow(err);
  }
}

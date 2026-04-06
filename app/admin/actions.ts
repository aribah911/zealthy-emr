"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function createPatient(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    throw new Error("Invalid patient data");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.patient.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePatient(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (Number.isNaN(id) || !name || !email) {
    throw new Error("Invalid patient data");
  }

  const data: {
    name: string;
    email: string;
    passwordHash?: string;
  } = {
    name,
    email,
  };

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  await prisma.patient.update({
    where: { id },
    data,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${id}`);
  redirect(`/admin/patients?id=${id}`);
}

export async function createAppointment(formData: FormData) {
  const patientId = Number(formData.get("patientId"));
  const providerName = String(formData.get("providerName") ?? "");
  const startDatetime = String(formData.get("startDatetime") ?? "");
  const repeatScheduleRaw = String(formData.get("repeatSchedule") ?? "");
  const repeatEndDateRaw = String(formData.get("repeatEndDate") ?? "");

  if (Number.isNaN(patientId)) {
    throw new Error("Invalid appointment data");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    throw new Error("Invalid patient");
  }

  await prisma.appointment.create({
    data: {
      patientId,
      providerName,
      startDatetime: new Date(startDatetime),
      repeatSchedule: repeatScheduleRaw || null,
      repeatEndDate: repeatEndDateRaw ? new Date(repeatEndDateRaw) : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}

export async function updateAppointment(formData: FormData) {
  const id = Number(formData.get("id"));
  const patientId = Number(formData.get("patientId"));
  const providerName = String(formData.get("providerName") ?? "");
  const startDatetime = String(formData.get("startDatetime") ?? "");
  const repeatScheduleRaw = String(formData.get("repeatSchedule") ?? "");
  const repeatEndDateRaw = String(formData.get("repeatEndDate") ?? "");

  if (Number.isNaN(id) || Number.isNaN(patientId)) {
    throw new Error("Invalid appointment id");
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      providerName,
      startDatetime: new Date(startDatetime),
      repeatSchedule: repeatScheduleRaw || null,
      repeatEndDate: repeatEndDateRaw ? new Date(repeatEndDateRaw) : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}

export async function deleteAppointment(formData: FormData) {
  const id = Number(formData.get("id"));
  const patientId = Number(formData.get("patientId"));

  if (Number.isNaN(id) || Number.isNaN(patientId)) {
    throw new Error("Invalid appointment id");
  }

  await prisma.appointment.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}

export async function createPrescription(formData: FormData) {
  const patientId = Number(formData.get("patientId"));
  const medicationName = String(formData.get("medicationName") ?? "");
  const dosage = String(formData.get("dosage") ?? "");
  const quantity = Number(formData.get("quantity"));
  const refillOn = String(formData.get("refillOn") ?? "");
  const refillScheduleRaw = String(formData.get("refillSchedule") ?? "");

  if (Number.isNaN(patientId) || Number.isNaN(quantity)) {
    throw new Error("Invalid prescription data");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    throw new Error("Invalid patient");
  }

  const validMedication = await prisma.medicationOption.findFirst({
    where: { type: "medication", value: medicationName },
  });

  const validDosage = await prisma.medicationOption.findFirst({
    where: { type: "dosage", value: dosage },
  });

  if (!validMedication || !validDosage) {
    throw new Error("Invalid medication or dosage");
  }

  await prisma.prescription.create({
    data: {
      patientId,
      medicationName,
      dosage,
      quantity,
      refillOn: new Date(refillOn),
      refillSchedule: refillScheduleRaw || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}

export async function updatePrescription(formData: FormData) {
  const id = Number(formData.get("id"));
  const patientId = Number(formData.get("patientId"));
  const medicationName = String(formData.get("medicationName") ?? "");
  const dosage = String(formData.get("dosage") ?? "");
  const quantity = Number(formData.get("quantity"));
  const refillOn = String(formData.get("refillOn") ?? "");
  const refillScheduleRaw = String(formData.get("refillSchedule") ?? "");

  if (Number.isNaN(id) || Number.isNaN(patientId)) {
    throw new Error("Invalid prescription id");
  }

  // simple validation — just check it exists in seeded table
  const validMedication = await prisma.medicationOption.findFirst({
    where: { type: "medication", value: medicationName },
  });

  const validDosage = await prisma.medicationOption.findFirst({
    where: { type: "dosage", value: dosage },
  });

  if (!validMedication || !validDosage) {
    throw new Error("Invalid medication or dosage");
  }

  await prisma.prescription.update({
    where: { id },
    data: {
      medicationName,
      dosage,
      quantity,
      refillOn: new Date(refillOn),
      refillSchedule: refillScheduleRaw || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}

export async function deletePrescription(formData: FormData) {
  const id = Number(formData.get("id"));
  const patientId = Number(formData.get("patientId"));

  if (Number.isNaN(id) || Number.isNaN(patientId)) {
    throw new Error("Invalid prescription id");
  }

  await prisma.prescription.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/patients?id=${patientId}`);
  redirect(`/admin/patients?id=${patientId}`);
}
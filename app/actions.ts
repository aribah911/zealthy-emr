"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createPatientSession, clearPatientSession } from "@/lib/auth";

export async function loginPatient(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const patient = await prisma.patient.findUnique({
    where: {
      email,
    },
  });

  if (!patient) {
    redirect("/?error=Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, patient.passwordHash);

  if (!passwordMatches) {
    redirect("/?error=Invalid email or password");
  }

  await createPatientSession(patient.id);

  redirect("/portal");
}

export async function logoutPatient() {
  await clearPatientSession();
  redirect("/");
}
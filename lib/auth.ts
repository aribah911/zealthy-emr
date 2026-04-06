import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "patientId";

export async function createPatientSession(patientId: number) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, String(patientId), {
    httpOnly: true,
    path: "/",
  });
}

export async function clearPatientSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getLoggedInPatient() {
  const cookieStore = await cookies();
  const patientId = cookieStore.get(COOKIE_NAME)?.value;

  if (!patientId) {
    return null;
  }

  const patient = await prisma.patient.findUnique({
    where: {
      id: Number(patientId),
    },
    include: {
      appointments: true,
      prescriptions: true,
    },
  });

  return patient;
}
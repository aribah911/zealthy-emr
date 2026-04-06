import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";
import data from "./data.json";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database process started.");

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.medicationOption.deleteMany();

  // Insert medication options with dosage
  for (const med of data.medications) {
    await prisma.medicationOption.create({
      data: {
        type: "medication",
        value: med,
      },
    });
  }
  // Insert dosages into medication options
  for (const dose of data.dosages) {
    await prisma.medicationOption.create({
      data: {
        type: "dosage",
        value: dose,
      },
    });
  }

  // Insert patients data
  for (const user of data.users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const patient = await prisma.patient.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
      },
    });

    // Insert appointments
    for (const appt of user.appointments) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          providerName: appt.provider,
          startDatetime: new Date(appt.datetime),
          repeatSchedule: appt.repeat,
        },
      });
    }

    // Insert prescriptions
    for (const rx of user.prescriptions) {
      await prisma.prescription.create({
        data: {
          patientId: patient.id,
          medicationName: rx.medication,
          dosage: rx.dosage,
          quantity: rx.quantity,
          refillOn: new Date(rx.refill_on),
          refillSchedule: rx.refill_schedule,
        },
      });
    }
  }

  console.log("Seeding database process completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import data from "./data.json";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database process started.");

  await prisma.appointment.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.medicationOption.deleteMany();

  for (const med of data.medications) {
    await prisma.medicationOption.create({
      data: {
        type: "medication",
        value: med,
      },
    });
  }

  for (const dose of data.dosages) {
    await prisma.medicationOption.create({
      data: {
        type: "dosage",
        value: dose,
      },
    });
  }

  for (const user of data.users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const patient = await prisma.patient.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
      },
    });

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
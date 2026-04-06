-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "providerName" TEXT NOT NULL,
    "startDatetime" DATETIME NOT NULL,
    "repeatSchedule" TEXT,
    "repeatEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refillOn" DATETIME NOT NULL,
    "refillSchedule" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicationOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

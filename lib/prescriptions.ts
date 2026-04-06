type Prescription = {
  id: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  refillOn: Date;
  refillSchedule: string | null;
};

export type UpcomingRefill = {
  id: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  date: Date;
  refillSchedule: string | null;
};

export type RefillOccurrence = {
  id: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  date: Date;
  refillSchedule: string | null;
};

function addMonths(date: Date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

function getNextRefillDate(prescription: Prescription) {
  const now = new Date();
  let currentDate = new Date(prescription.refillOn);

  if (!prescription.refillSchedule) {
    return currentDate >= now ? currentDate : null;
  }

  while (currentDate < now) {
    if (prescription.refillSchedule === "monthly") {
      currentDate = addMonths(currentDate);
    } else {
      return null;
    }
  }

  return currentDate;
}

// portal summary uses this
export function getUpcomingRefills(prescriptions: Prescription[]) {
  const upcoming: UpcomingRefill[] = [];

  for (const prescription of prescriptions) {
    const nextDate = getNextRefillDate(prescription);

    if (nextDate) {
      upcoming.push({
        id: prescription.id,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        quantity: prescription.quantity,
        date: nextDate,
        refillSchedule: prescription.refillSchedule,
      });
    }
  }

  upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());

  return upcoming;
}

// patient portal drill-down uses this
export function getRefillsForNextThreeMonths(
  prescriptions: Prescription[]
) {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  const results: RefillOccurrence[] = [];

  for (const prescription of prescriptions) {
    let currentDate = getNextRefillDate(prescription);

    if (!currentDate) continue;

    if (!prescription.refillSchedule) {
      if (currentDate <= endDate) {
        results.push({
          id: prescription.id,
          medicationName: prescription.medicationName,
          dosage: prescription.dosage,
          quantity: prescription.quantity,
          date: currentDate,
          refillSchedule: prescription.refillSchedule,
        });
      }
      continue;
    }

    while (currentDate <= endDate) {
      results.push({
        id: prescription.id,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        quantity: prescription.quantity,
        date: new Date(currentDate),
        refillSchedule: prescription.refillSchedule,
      });

      if (prescription.refillSchedule === "monthly") {
        currentDate = addMonths(currentDate);
      } else {
        break;
      }
    }
  }

  results.sort((a, b) => a.date.getTime() - b.date.getTime());

  return results;
}
type Appointment = {
  id: number;
  providerName: string;
  startDatetime: Date;
  repeatSchedule: string | null;
  repeatEndDate: Date | null;
};

export type UpcomingAppointment = {
  id: number;
  providerName: string;
  date: Date;
  repeatSchedule: string | null;
  repeatEndDate: Date | null;
};

export type AppointmentOccurrence = {
  id: number;
  providerName: string;
  date: Date;
  repeatSchedule: string | null;
  repeatEndDate: Date | null;
};

function addDays(date: Date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
}

function addMonths(date: Date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

function getNextAppointmentDate(appointment: Appointment) {
  const now = new Date();
  let currentDate = new Date(appointment.startDatetime);

  if (!appointment.repeatSchedule) {
    return currentDate >= now ? currentDate : null;
  }

  while (currentDate < now) {
    if (appointment.repeatEndDate && currentDate > appointment.repeatEndDate) {
      return null;
    }

    if (appointment.repeatSchedule === "weekly") {
      currentDate = addDays(currentDate);
    } else if (appointment.repeatSchedule === "monthly") {
      currentDate = addMonths(currentDate);
    } else {
      return null;
    }
  }

  if (appointment.repeatEndDate && currentDate > appointment.repeatEndDate) {
    return null;
  }

  return currentDate;
}

// EMR uses this
export function getUpcomingAppointments(appointments: Appointment[]) {
  const upcoming: UpcomingAppointment[] = [];

  for (const appointment of appointments) {
    const nextDate = getNextAppointmentDate(appointment);

    if (nextDate) {
      upcoming.push({
        id: appointment.id,
        providerName: appointment.providerName,
        date: nextDate,
        repeatSchedule: appointment.repeatSchedule,
        repeatEndDate: appointment.repeatEndDate,
      });
    }
  }

  upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());

  return upcoming;
}

// Patient portal uses this
export function getAppointmentsForNextThreeMonths(
  appointments: Appointment[]
) {
  const now = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  const results: AppointmentOccurrence[] = [];

  for (const appointment of appointments) {
    let currentDate = getNextAppointmentDate(appointment);

    if (!currentDate) continue;

    if (!appointment.repeatSchedule) {
      if (currentDate <= endDate) {
        results.push({
          id: appointment.id,
          providerName: appointment.providerName,
          date: currentDate,
          repeatSchedule: appointment.repeatSchedule,
          repeatEndDate: appointment.repeatEndDate,
        });
      }
      continue;
    }

    while (currentDate <= endDate) {
      if (appointment.repeatEndDate && currentDate > appointment.repeatEndDate) {
        break;
      }

      results.push({
        id: appointment.id,
        providerName: appointment.providerName,
        date: new Date(currentDate),
        repeatSchedule: appointment.repeatSchedule,
        repeatEndDate: appointment.repeatEndDate,
      });

      if (appointment.repeatSchedule === "weekly") {
        currentDate = addDays(currentDate);
      } else if (appointment.repeatSchedule === "monthly") {
        currentDate = addMonths(currentDate);
      } else {
        break;
      }
    }
  }

  results.sort((a, b) => a.date.getTime() - b.date.getTime());

  return results;
}
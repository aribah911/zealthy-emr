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
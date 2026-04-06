import Link from "next/link";
import { redirect } from "next/navigation";
import { getLoggedInPatient } from "@/lib/auth";
import { getAppointmentsForNextThreeMonths } from "@/lib/appointments";
import { getUpcomingRefills } from "@/lib/prescriptions";
import { logoutPatient } from "@/app/actions";

function isWithinNext7Days(date: Date) {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  return date >= now && date <= endDate;
}

export default async function PortalPage() {
  const patient = await getLoggedInPatient();

  if (!patient) {
    redirect("/");
  }

  const appointments = getAppointmentsForNextThreeMonths(patient.appointments);
  const upcomingAppointments = appointments.filter((appointment) =>
    isWithinNext7Days(appointment.date)
  );

  const refills = getUpcomingRefills(patient.prescriptions);
  const upcomingRefills = refills.filter((refill) =>
    isWithinNext7Days(refill.date)
  );

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-xl font-semibold">Patient Portal</h1>
          <p className="mb-1">{patient.name}</p>
          <p>{patient.email}</p>
        </div>

        <form action={logoutPatient}>
          <button type="submit" className="border px-3 py-1 text-sm">
            Logout
          </button>
        </form>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Appointments in Next 7 Days</h2>

          <Link
            href="/portal/appointments"
            className="text-yellow-300 hover:underline"
          >
            View All
          </Link>
        </div>

        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 text-left">Provider</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment: (typeof upcomingAppointments)[number], index: number) => (
                <tr
                  key={`${appointment.id}-${appointment.date.toISOString()}-${index}`}
                  className="border-t border-gray-700 hover:bg-yellow-200/20"
                >
                  <td className="p-2">{appointment.providerName}</td>
                  <td className="p-2">
                    {appointment.date.toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {appointment.date.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-2 text-gray-400">
                  No appointments in the next 7 days
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Medication Refills in Next 7 Days
          </h2>

          <Link
            href="/portal/prescriptions"
            className="text-yellow-300 hover:underline"
          >
            View All
          </Link>
        </div>

        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 text-left">Medication</th>
              <th className="p-2 text-left">Dosage</th>
              <th className="p-2 text-left">Refill On</th>
            </tr>
          </thead>

          <tbody>
            {upcomingRefills.length > 0 ? (
              upcomingRefills.map((refill: (typeof upcomingRefills)[number], index: number) => (
                <tr
                  key={`${refill.id}-${refill.date.toISOString()}-${index}`}
                  className="border-t border-gray-700 hover:bg-yellow-200/20"
                >
                  <td className="p-2">{refill.medicationName}</td>
                  <td className="p-2">{refill.dosage}</td>
                  <td className="p-2">
                    {refill.date.toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-2 text-gray-400">
                  No refills in the next 7 days
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
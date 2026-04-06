import Link from "next/link";
import { redirect } from "next/navigation";
import { getLoggedInPatient } from "@/lib/auth";
import { getAppointmentsForNextThreeMonths } from "@/lib/appointments";

export default async function AppointmentsPage() {
  const patient = await getLoggedInPatient();

  if (!patient) {
    redirect("/");
  }

  const appointments = getAppointmentsForNextThreeMonths(patient.appointments);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-xl font-semibold">Upcoming Appointments</h1>

        <Link href="/portal" className="border px-3 py-1 text-sm">
          Back
        </Link>
      </div>

      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 text-left">Provider</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Repeat</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
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
                <td className="p-2">{appointment.repeatSchedule || "None"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-gray-400">
                No appointments in the next 3 months
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
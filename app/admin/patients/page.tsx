import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUpcomingAppointments } from "@/lib/appointments";
import { deleteAppointment, deletePrescription } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function PatientPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const patientId = Number(id);

  if (!id || Number.isNaN(patientId)) {
    notFound();
  }

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    include: {
      appointments: true,
      prescriptions: true,
    },
  });

  if (!patient) {
    notFound();
  }

  const upcomingAppointments = getUpcomingAppointments(patient.appointments);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">{patient.name}</h1>
          <p className="mb-1">{patient.email}</p>
          <p>Created: {new Date(patient.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>

          <Link
            href={`/admin/appointments/add?patientId=${patient.id}`}
            className="border px-3 py-1 text-sm"
          >
            + Add Appointment
          </Link>
        </div>

        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 text-left">Provider</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Repeat</th>
              <th className="p-2 text-left">End Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-t border-gray-700 hover:bg-yellow-200/20"
                >
                  <td className="p-2">{appointment.providerName}</td>
                  <td className="p-2">{appointment.date.toLocaleString()}</td>
                  <td className="p-2">{appointment.repeatSchedule || "None"}</td>
                  <td className="p-2">
                    {appointment.repeatEndDate
                      ? new Date(appointment.repeatEndDate).toLocaleDateString()
                      : "None"}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/appointments/edit?id=${appointment.id}&patientId=${patient.id}`}
                        className="text-yellow-300 hover:underline"
                      >
                        Edit
                      </Link>

                      <form action={deleteAppointment}>
                        <input type="hidden" name="id" value={appointment.id} />
                        <input
                          type="hidden"
                          name="patientId"
                          value={patient.id}
                        />
                        <button
                          type="submit"
                          className="text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-gray-400">
                  No upcoming appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Prescriptions</h2>

          <Link
            href={`/admin/prescriptions/add?patientId=${patient.id}`}
            className="border px-3 py-1 text-sm"
          >
            + Add Prescription
          </Link>
        </div>

        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 text-left">Medication</th>
              <th className="p-2 text-left">Dosage</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Refill On</th>
              <th className="p-2 text-left">Refill Schedule</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patient.prescriptions.length > 0 ? (
              patient.prescriptions.map((prescription) => (
                <tr
                  key={prescription.id}
                  className="border-t border-gray-700 hover:bg-yellow-200/20"
                >
                  <td className="p-2">{prescription.medicationName}</td>
                  <td className="p-2">{prescription.dosage}</td>
                  <td className="p-2">{prescription.quantity}</td>
                  <td className="p-2">
                    {new Date(prescription.refillOn).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {prescription.refillSchedule || "None"}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/prescriptions/edit?id=${prescription.id}&patientId=${patient.id}`}
                        className="text-yellow-300 hover:underline"
                      >
                        Edit
                      </Link>

                      <form action={deletePrescription}>
                        <input type="hidden" name="id" value={prescription.id} />
                        <input
                          type="hidden"
                          name="patientId"
                          value={patient.id}
                        />
                        <button
                          type="submit"
                          className="text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-2 text-gray-400">
                  No prescriptions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
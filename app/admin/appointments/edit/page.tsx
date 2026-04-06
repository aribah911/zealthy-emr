import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAppointment } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{
    id?: string;
    patientId?: string;
  }>;
};

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateOnly(date: Date | null) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function EditAppointmentPage({ searchParams }: Props) {
  const { id, patientId } = await searchParams;
  const appointmentId = Number(id);
  const parsedPatientId = Number(patientId);

  if (!id || !patientId || Number.isNaN(appointmentId) || Number.isNaN(parsedPatientId)) {
    notFound();
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Edit Appointment</h1>

      <form action={updateAppointment} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={appointment.id} />
        <input type="hidden" name="patientId" value={parsedPatientId} />

        <div>
          <label className="mb-1 block">Provider Name</label>
          <input
            name="providerName"
            defaultValue={appointment.providerName}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Start Date / Time</label>
          <input
            name="startDatetime"
            type="datetime-local"
            defaultValue={formatDateTimeLocal(new Date(appointment.startDatetime))}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Repeat Schedule</label>
          <select
            name="repeatSchedule"
            defaultValue={appointment.repeatSchedule ?? ""}
            className="w-full border p-2"
          >
            <option value="">None</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">Repeat End Date</label>
          <input
            name="repeatEndDate"
            type="date"
            defaultValue={formatDateOnly(
              appointment.repeatEndDate ? new Date(appointment.repeatEndDate) : null
            )}
            className="w-full border p-2"
          />
        </div>

        <button type="submit" className="border px-4 py-2">
          Save Appointment
        </button>
      </form>
    </div>
  );
}
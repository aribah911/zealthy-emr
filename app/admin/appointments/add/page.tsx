import { notFound } from "next/navigation";
import { createAppointment } from "@/app/admin/actions";
import Link from "next/link";


type Props = {
  searchParams: Promise<{
    patientId?: string;
  }>;
};

export default async function AddAppointmentPage({ searchParams }: Props) {
  const { patientId } = await searchParams;
  const parsedPatientId = Number(patientId);

  if (!patientId || Number.isNaN(parsedPatientId)) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Add Appointment</h1>

      <form action={createAppointment} className="max-w-xl space-y-4">
        <input type="hidden" name="patientId" value={parsedPatientId} />

        <div>
          <label className="mb-1 block">Provider Name</label>
          <input name="providerName" className="w-full border p-2" required />
        </div>

        <div>
          <label className="mb-1 block">Start Date / Time</label>
          <input
            name="startDatetime"
            type="datetime-local"
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Repeat Schedule</label>
          <select name="repeatSchedule" className="w-full border p-2">
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
            defaultValue=""
            className="w-full border p-2"
          />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button type="submit" className="border px-4 py-2">
            Add Appointment
          </button>

          <Link
            href={`/admin/patients?id=${patientId}`}
            className="border px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
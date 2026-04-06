import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createPrescription } from "@/app/admin/actions";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    patientId?: string;
  }>;
};

export default async function AddPrescriptionPage({ searchParams }: Props) {
  const { patientId } = await searchParams;
  const parsedPatientId = Number(patientId);

  if (!patientId || Number.isNaN(parsedPatientId)) {
    notFound();
  }

  const medicationOptions = await prisma.medicationOption.findMany({
    where: { type: "medication" },
  });

  const dosageOptions = await prisma.medicationOption.findMany({
    where: { type: "dosage" },
  });

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Add Prescription</h1>

      <form action={createPrescription} className="max-w-xl space-y-4">
        <input type="hidden" name="patientId" value={parsedPatientId} />

        <div>
          <label className="mb-1 block">Medication Name</label>
          <select name="medicationName" className="w-full border p-2" required>
            <option value="">Select</option>
            {medicationOptions.map((m) => (
              <option key={m.id} value={m.value}>
                {m.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Dosage</label>
          <select name="dosage" className="w-full border p-2" required>
            <option value="">Select</option>
            {dosageOptions.map((d) => (
              <option key={d.id} value={d.value}>
                {d.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Quantity</label>
          <input name="quantity" type="number" className="w-full border p-2" required />
        </div>

        <div>
          <label className="mb-1 block">Refill On</label>
          <input name="refillOn" type="date" className="w-full border p-2" required />
        </div>

        <div>
          <label className="mb-1 block">Refill Schedule</label>
          <select name="refillSchedule" className="w-full border p-2">
            <option value="">None</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button type="submit" className="border px-4 py-2">
            Add Prescription
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
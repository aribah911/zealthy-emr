import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePrescription } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{
    id?: string;
    patientId?: string;
  }>;
};

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function EditPrescriptionPage({ searchParams }: Props) {
  const { id, patientId } = await searchParams;
  const prescriptionId = Number(id);
  const parsedPatientId = Number(patientId);

  if (!id || !patientId || Number.isNaN(prescriptionId) || Number.isNaN(parsedPatientId)) {
    notFound();
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
  });

  if (!prescription) {
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
      <h1 className="mb-4 text-xl font-semibold">Edit Prescription</h1>

      <form action={updatePrescription} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={prescription.id} />
        <input type="hidden" name="patientId" value={parsedPatientId} />

        <div>
          <label className="mb-1 block">Medication Name</label>
          <select
            name="medicationName"
            defaultValue={prescription.medicationName}
            className="w-full border p-2"
            required
          >
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
          <select
            name="dosage"
            defaultValue={prescription.dosage}
            className="w-full border p-2"
            required
          >
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
          <input
            name="quantity"
            type="number"
            defaultValue={prescription.quantity}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Refill On</label>
          <input
            name="refillOn"
            type="date"
            defaultValue={formatDateOnly(new Date(prescription.refillOn))}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Refill Schedule</label>
          <select
            name="refillSchedule"
            defaultValue={prescription.refillSchedule ?? ""}
            className="w-full border p-2"
          >
            <option value="">None</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button type="submit" className="border px-4 py-2">
          Save Prescription
        </button>
      </form>
    </div>
  );
}
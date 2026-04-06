import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePatient } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function EditPatientPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const patientId = Number(id);

  if (!id || Number.isNaN(patientId)) {
    notFound();
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Edit Patient</h1>

      <form action={updatePatient} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={patient.id} />

        <div>
          <label className="mb-1 block">Name</label>
          <input
            name="name"
            defaultValue={patient.name}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={patient.email}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            name="password"
            type="text"
            placeholder="Enter new password"
            className="w-full border p-2"
          />
        </div>

        <button type="submit" className="border px-4 py-2">
          Save Patient
        </button>
      </form>
    </div>
  );
}
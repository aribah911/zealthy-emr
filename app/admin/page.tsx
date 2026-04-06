import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      appointments: true,
      prescriptions: true,
    },
  });

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Link href="/admin/patients/new" className="border px-3 py-1 text-sm">
          Add Patient
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Appointments</th>
              <th className="p-3">Prescriptions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient: (typeof patients)[number]) => (
              <tr
                key={patient.id}
                className="border-t border-gray-700 hover:bg-yellow-200/20"
              >
                <td className="p-3">
                  <Link href={`/admin/patients/${patient.id}`}>{patient.name}</Link>
                </td>
                <td className="p-3">{patient.email}</td>
                <td className="p-3">{patient.appointments.length}</td>
                <td className="p-3">{patient.prescriptions.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
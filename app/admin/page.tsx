import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
      <div  className="mb-6 flex items-start justify-between">
        <h1 className="mb-4 text-xl font-semibold">Admin Page</h1>
        <Link
            href={`/admin/patients/add`}
            className="border px-3 py-1 text-sm"
        >
            Add Patient
        </Link>
      </div>
      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Appointments</th>
            <th className="p-2 text-left">Prescriptions</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient : (typeof patients)[number]) => (
            <tr
              key={patient.id}
              className="border-t border-gray-700 hover:bg-yellow-200/20"
            >
              <td className="p-2">{patient.name}</td>
              <td className="p-2">{patient.email}</td>
              <td className="p-2">{patient.appointments.length}</td>
              <td className="p-2">{patient.prescriptions.length}</td>
              <td className="p-2">
                {new Date(patient.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <Link
                  href={`/admin/patients?id=${patient.id}`}
                  className="text-yellow-300 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
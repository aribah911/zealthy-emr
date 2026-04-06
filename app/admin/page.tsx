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
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Admin Page</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Appointments</th>
            <th className="p-2 text-left">Prescriptions</th>
            <th className="p-2 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-t">
              <td className="p-2">{patient.name}</td>
              <td className="p-2">{patient.email}</td>
              <td className="p-2">{patient.appointments.length}</td>
              <td className="p-2">{patient.prescriptions.length}</td>
              <td className="p-2">
                {new Date(patient.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
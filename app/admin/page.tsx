import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const patients = await prisma.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      appointments: true,
      prescriptions: true,
    },
  });

  return (
    <div>
      <h1>Admin Page</h1>

      {patients.map((patient) => (
        <div key={patient.id}>
          <p>{patient.name}</p>
          <p>{patient.email}</p>
          <p>Appointments: {patient.appointments.length}</p>
          <p>Prescriptions: {patient.prescriptions.length}</p>
        </div>
      ))}
    </div>
  );
}
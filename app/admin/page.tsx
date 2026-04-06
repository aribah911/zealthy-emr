import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const patients = await prisma.patient.findMany();

  console.log(patients);

  return <div>Admin page</div>;
}
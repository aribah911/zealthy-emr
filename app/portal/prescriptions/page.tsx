import Link from "next/link";
import { redirect } from "next/navigation";
import { getLoggedInPatient } from "@/lib/auth";
import { getRefillsForNextThreeMonths } from "@/lib/prescriptions";

export default async function PrescriptionsPage() {
  const patient = await getLoggedInPatient();

  if (!patient) {
    redirect("/");
  }

  const prescriptions = getRefillsForNextThreeMonths(patient.prescriptions);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-xl font-semibold">Prescription Refills</h1>

        <Link href="/portal" className="border px-3 py-1 text-sm">
          Back
        </Link>
      </div>

      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 text-left">Medication</th>
            <th className="p-2 text-left">Dosage</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Refill On</th>
            <th className="p-2 text-left">Refill Schedule</th>
          </tr>
        </thead>

        <tbody>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription: (typeof prescriptions)[number], index: number) => (
              <tr
                key={`${prescription.id}-${prescription.date.toISOString()}-${index}`}
                className="border-t border-gray-700 hover:bg-yellow-200/20"
              >
                <td className="p-2">{prescription.medicationName}</td>
                <td className="p-2">{prescription.dosage}</td>
                <td className="p-2">{prescription.quantity}</td>
                <td className="p-2">
                  {prescription.date.toLocaleDateString()}
                </td>
                <td className="p-2">
                  {prescription.refillSchedule || "None"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-2 text-gray-400">
                No refills in the next 3 months
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
import { createPatient } from "@/app/admin/actions";
import Link from "next/link";

export default function AddPatientPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Add Patient</h1>

      <form action={createPatient} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block">Name</label>
          <input name="name" className="w-full border p-2" required />
        </div>

        <div>
          <label className="mb-1 block">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            name="password"
            type="text"
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button type="submit" className="border px-4 py-2">
            Save Patient
          </button>

          <Link
            href={`/admin`}
            className="border px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
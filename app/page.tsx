import { loginPatient } from "@/app/actions";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-xl font-semibold">Patient Login</h1>

      {error ? <p className="mb-4 text-red-300">{error}</p> : null}

      <form action={loginPatient} className="max-w-md">
        <div className="mb-4">
          <label className="mb-1 block text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-gray-700 bg-black p-2 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-gray-700 bg-black p-2 text-white"
          />
        </div>

        <button type="submit" className="border px-3 py-1 text-sm">
          Login
        </button>
      </form>
    </div>
  );
}
import Link from "next/link";

export default function Landing() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-wizard-900">Potter CRM</h1>
        <p className="text-lg text-stone-700">
          A practitioner's ledger for clients, magical offerings, contracts, and payments.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-md bg-wizard-600 text-white hover:bg-wizard-700"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-md border border-wizard-600 text-wizard-700 hover:bg-wizard-50"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db/dashboard";
import { PageHeader } from "@/components/page-header";
import { Card, Empty } from "@/components/ui";
import { formatCents } from "@/lib/money";

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await getDashboardStats(user.id);

  return (
    <>
      <PageHeader title={`Welcome, ${user.name || "practitioner"}`} subtitle="Your grimoire at a glance." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Clients" value={stats.clientCount} href="/clients" />
        <Stat label="Offerings" value={stats.offeringCount} href="/offerings" />
        <Stat label="Active contracts" value={stats.activeContracts} href="/contracts" />
        <Stat label="Outstanding balance" value={formatCents(stats.outstanding)} href="/contracts" />
      </div>

      <h2 className="text-lg font-semibold text-stone-900 mb-3">Recent payments</h2>
      {stats.recentPayments.length === 0 ? (
        <Empty>No payments yet.</Empty>
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-stone-200">
            {stats.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link href={`/contracts/${p.contract.id}`} className="font-medium text-wizard-700 hover:underline">
                    {p.contract.title}
                  </Link>
                  <span className="text-stone-500"> · {p.contract.client.name}</span>
                </div>
                <div className="flex items-center gap-4 text-stone-600">
                  <span>{p.paidAt.toISOString().slice(0, 10)}</span>
                  <span className="font-medium text-stone-900">{formatCents(p.amountCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:border-wizard-300 transition">
        <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-stone-900">{value}</p>
      </Card>
    </Link>
  );
}

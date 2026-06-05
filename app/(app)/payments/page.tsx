import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listPayments } from "@/lib/db/payments";
import { PageHeader } from "@/components/page-header";
import { Card, Empty } from "@/components/ui";
import { formatCents } from "@/lib/money";

export default async function PaymentsPage() {
  const user = await requireUser();
  const payments = await listPayments(user.id);
  const total = payments.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} payment${payments.length === 1 ? "" : "s"} totaling ${formatCents(total)}`}
      />
      {payments.length === 0 ? (
        <Empty>No payments recorded yet.</Empty>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">{p.paidAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/clients/${p.contract.client.id}`} className="text-wizard-700 hover:underline">
                      {p.contract.client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/contracts/${p.contract.id}`} className="text-stone-700 hover:underline">
                      {p.contract.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCents(p.amountCents)}</td>
                  <td className="px-4 py-3 text-stone-600">{p.method ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

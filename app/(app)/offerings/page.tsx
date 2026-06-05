import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listOfferings } from "@/lib/db/offerings";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, Empty } from "@/components/ui";
import { formatCents } from "@/lib/money";

export default async function OfferingsPage() {
  const user = await requireUser();
  const offerings = await listOfferings(user.id);

  return (
    <>
      <PageHeader
        title="Offerings"
        subtitle="Your catalogue of curses, charms, enchantments, and services."
        action={{ href: "/offerings/new", label: "New offering" }}
      />
      {offerings.length === 0 ? (
        <Empty>
          No offerings yet.{" "}
          <Link href="/offerings/new" className="text-wizard-700 hover:underline">
            Add your first one
          </Link>
          .
        </Empty>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">In contracts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {offerings.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/offerings/${o.id}`} className="text-wizard-700 hover:underline">
                      {o.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.category ? <Badge>{o.category}</Badge> : <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-4 py-3">{formatCents(o.priceCents)}</td>
                  <td className="px-4 py-3 text-stone-600">{o._count.contractItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listClients } from "@/lib/db/clients";
import { PageHeader } from "@/components/page-header";
import { Card, Empty } from "@/components/ui";

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await listClients(user.id);

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="The witches, wizards, and muggles who pay for your craft."
        action={{ href: "/clients/new", label: "New client" }}
      />
      {clients.length === 0 ? (
        <Empty>
          No clients yet.{" "}
          <Link href="/clients/new" className="text-wizard-700 hover:underline">
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Contracts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/clients/${c.id}`} className="text-wizard-700 hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{c._count.contracts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

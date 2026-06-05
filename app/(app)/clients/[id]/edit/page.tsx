import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getClient } from "@/lib/db/clients";
import { PageHeader } from "@/components/page-header";
import { ClientForm } from "@/components/forms/client-form";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const client = await getClient(user.id, id);
  if (!client) notFound();

  return (
    <>
      <PageHeader title="Edit client" subtitle={client.name} />
      <ClientForm mode="edit" clientId={client.id} initial={client} />
    </>
  );
}

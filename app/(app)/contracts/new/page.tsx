import { requireUser } from "@/lib/auth";
import { listClientsForSelect } from "@/lib/db/clients";
import { listOfferingsForSelect } from "@/lib/db/offerings";
import { PageHeader } from "@/components/page-header";
import { ContractCreateForm } from "@/components/forms/contract-create-form";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const user = await requireUser();
  const [clients, offerings] = await Promise.all([
    listClientsForSelect(user.id),
    listOfferingsForSelect(user.id),
  ]);

  return (
    <>
      <PageHeader title="New contract" subtitle="Bind a client to one or more offerings." />
      <ContractCreateForm clients={clients} offerings={offerings} defaultClientId={clientId} />
    </>
  );
}

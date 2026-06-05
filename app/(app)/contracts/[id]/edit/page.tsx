import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getContract } from "@/lib/db/contracts";
import { listClientsForSelect } from "@/lib/db/clients";
import { PageHeader } from "@/components/page-header";
import { ContractEditForm } from "@/components/forms/contract-edit-form";

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const [contract, clients] = await Promise.all([
    getContract(user.id, id),
    listClientsForSelect(user.id),
  ]);
  if (!contract) notFound();

  return (
    <>
      <PageHeader title="Edit contract" subtitle={contract.title} />
      <ContractEditForm contract={contract} clients={clients} />
    </>
  );
}

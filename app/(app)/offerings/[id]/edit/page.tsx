import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOffering } from "@/lib/db/offerings";
import { PageHeader } from "@/components/page-header";
import { OfferingForm } from "@/components/forms/offering-form";

export default async function EditOfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const offering = await getOffering(user.id, id);
  if (!offering) notFound();

  return (
    <>
      <PageHeader title="Edit offering" subtitle={offering.name} />
      <OfferingForm mode="edit" offeringId={offering.id} initial={offering} />
    </>
  );
}

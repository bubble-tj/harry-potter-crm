import { PageHeader } from "@/components/page-header";
import { OfferingForm } from "@/components/forms/offering-form";

export default function NewOfferingPage() {
  return (
    <>
      <PageHeader title="New offering" subtitle="Add something to your magical menu." />
      <OfferingForm mode="create" />
    </>
  );
}

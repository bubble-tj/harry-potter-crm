import { PageHeader } from "@/components/page-header";
import { ClientForm } from "@/components/forms/client-form";

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="New client" subtitle="Add someone you'll be conjuring for." />
      <ClientForm mode="create" />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOffering } from "@/lib/db/offerings";
import { deleteOfferingAction } from "@/lib/actions/offerings";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card } from "@/components/ui";
import { formatCents } from "@/lib/money";

export default async function OfferingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await requireUser();
  const offering = await getOffering(user.id, id);
  if (!offering) notFound();

  const remove = deleteOfferingAction.bind(null, offering.id);

  return (
    <>
      <PageHeader title={offering.name} />
      {error === "in-use" ? (
        <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
          This offering is referenced by one or more contracts and cannot be deleted.
        </p>
      ) : null}
      <Card className="mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-stone-500">Category</dt>
            <dd className="mt-1">
              {offering.category ? <Badge>{offering.category}</Badge> : <span className="text-stone-400">—</span>}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Price</dt>
            <dd className="mt-1 text-lg font-medium">{formatCents(offering.priceCents)}</dd>
          </div>
        </dl>
        {offering.description ? (
          <>
            <h2 className="mt-6 text-sm font-semibold text-stone-500">Description</h2>
            <p className="mt-2 text-sm whitespace-pre-wrap text-stone-700">{offering.description}</p>
          </>
        ) : null}
      </Card>
      <div className="flex items-center gap-3">
        <Link
          href={`/offerings/${offering.id}/edit`}
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Edit
        </Link>
        <form action={remove}>
          <Button variant="danger" type="submit">Delete</Button>
        </form>
      </div>
    </>
  );
}

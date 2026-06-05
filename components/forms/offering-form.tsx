"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, FieldError, Input, Label, Textarea } from "@/components/ui";
import {
  createOfferingAction,
  updateOfferingAction,
  type OfferingActionState,
} from "@/lib/actions/offerings";

type OfferingFormValues = {
  name?: string | null;
  description?: string | null;
  priceCents?: number | null;
  category?: string | null;
};

export function OfferingForm({
  mode,
  offeringId,
  initial,
}: {
  mode: "create" | "edit";
  offeringId?: string;
  initial?: OfferingFormValues;
}) {
  const action =
    mode === "create"
      ? createOfferingAction
      : updateOfferingAction.bind(null, offeringId!);

  const [state, formAction, pending] = useActionState<OfferingActionState, FormData>(action, undefined);
  const priceDefault =
    initial?.priceCents != null ? (initial.priceCents / 100).toFixed(2) : "";

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initial?.name ?? ""} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          placeholder="Curse, Enchantment, Potion, Service…"
          defaultValue={initial?.category ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          name="price"
          inputMode="decimal"
          placeholder="0.00"
          defaultValue={priceDefault}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
        />
      </div>
      <FieldError message={state?.error} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create offering" : "Save changes"}
        </Button>
        <Link
          href={offeringId ? `/offerings/${offeringId}` : "/offerings"}
          className="text-sm text-stone-600 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

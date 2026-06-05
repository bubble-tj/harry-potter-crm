"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { offeringInputSchema } from "@/lib/validation/offerings";
import { createOffering, deleteOffering, updateOffering } from "@/lib/db/offerings";
import { parseCents } from "@/lib/money";

export type OfferingActionState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  return offeringInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceCents: parseCents(formData.get("price") as string | null),
    category: formData.get("category") ?? "",
  });
}

export async function createOfferingAction(_prev: OfferingActionState, formData: FormData): Promise<OfferingActionState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const created = await createOffering(user.id, parsed.data);
  revalidatePath("/offerings");
  redirect(`/offerings/${created.id}`);
}

export async function updateOfferingAction(
  id: string,
  _prev: OfferingActionState,
  formData: FormData,
): Promise<OfferingActionState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  await updateOffering(user.id, id, parsed.data);
  revalidatePath("/offerings");
  revalidatePath(`/offerings/${id}`);
  redirect(`/offerings/${id}`);
}

export async function deleteOfferingAction(id: string) {
  const user = await requireUser();
  try {
    await deleteOffering(user.id, id);
  } catch {
    redirect(`/offerings/${id}?error=in-use`);
  }
  revalidatePath("/offerings");
  redirect("/offerings");
}

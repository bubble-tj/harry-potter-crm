"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContractStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { contractCreateSchema, contractUpdateSchema } from "@/lib/validation/contracts";
import { createContract, deleteContract, updateContract } from "@/lib/db/contracts";

export type ContractActionState = { error?: string } | undefined;

function parseItems(formData: FormData) {
  const ids = formData.getAll("itemOfferingId").map(String);
  const qtys = formData.getAll("itemQuantity").map((v) => Number(v));
  return ids
    .map((offeringId, i) => ({ offeringId, quantity: Number.isFinite(qtys[i]) ? qtys[i] : 1 }))
    .filter((it) => it.offeringId);
}

export async function createContractAction(
  _prev: ContractActionState,
  formData: FormData,
): Promise<ContractActionState> {
  const user = await requireUser();
  const parsed = contractCreateSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    status: (formData.get("status") as ContractStatus) || ContractStatus.DRAFT,
    startDate: formData.get("startDate") ?? "",
    dueDate: formData.get("dueDate") ?? "",
    notes: formData.get("notes") ?? "",
    items: parseItems(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  let created;
  try {
    created = await createContract(user.id, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create contract" };
  }

  revalidatePath("/contracts");
  revalidatePath(`/clients/${parsed.data.clientId}`);
  redirect(`/contracts/${created.id}`);
}

export async function updateContractAction(
  id: string,
  _prev: ContractActionState,
  formData: FormData,
): Promise<ContractActionState> {
  const user = await requireUser();
  const parsed = contractUpdateSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    status: (formData.get("status") as ContractStatus) || ContractStatus.DRAFT,
    startDate: formData.get("startDate") ?? "",
    dueDate: formData.get("dueDate") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await updateContract(user.id, id, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update contract" };
  }

  revalidatePath("/contracts");
  revalidatePath(`/contracts/${id}`);
  redirect(`/contracts/${id}`);
}

export async function deleteContractAction(id: string) {
  const user = await requireUser();
  await deleteContract(user.id, id);
  revalidatePath("/contracts");
  redirect("/contracts");
}

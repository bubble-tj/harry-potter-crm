"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { paymentInputSchema } from "@/lib/validation/payments";
import { createPayment, deletePayment } from "@/lib/db/payments";
import { parseCents } from "@/lib/money";

export type PaymentActionState = { error?: string; success?: boolean } | undefined;

export async function createPaymentAction(
  contractId: string,
  _prev: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const user = await requireUser();
  const parsed = paymentInputSchema.safeParse({
    contractId,
    amountCents: parseCents(formData.get("amount") as string | null),
    paidAt: formData.get("paidAt"),
    method: formData.get("method") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await createPayment(user.id, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to record payment" };
  }

  revalidatePath(`/contracts/${contractId}`);
  revalidatePath("/payments");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePaymentAction(id: string, contractId: string) {
  const user = await requireUser();
  await deletePayment(user.id, id);
  revalidatePath(`/contracts/${contractId}`);
  revalidatePath("/payments");
  revalidatePath("/dashboard");
}

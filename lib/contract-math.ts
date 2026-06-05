import type { ContractStatus } from "@prisma/client";

export function contractTotal(items: { quantity: number; priceCents: number }[]): number {
  return items.reduce((sum, it) => sum + it.quantity * it.priceCents, 0);
}

export function paidTotal(payments: { amountCents: number }[]): number {
  return payments.reduce((sum, p) => sum + p.amountCents, 0);
}

export function statusTone(status: ContractStatus): "draft" | "active" | "done" | "cancel" {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "ACTIVE":
      return "active";
    case "COMPLETED":
      return "done";
    case "CANCELED":
      return "cancel";
  }
}

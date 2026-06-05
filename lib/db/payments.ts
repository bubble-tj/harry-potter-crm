import { prisma } from "@/lib/prisma";
import type { PaymentInput } from "@/lib/validation/payments";

export function listPayments(userId: string) {
  return prisma.payment.findMany({
    where: { contract: { userId } },
    orderBy: { paidAt: "desc" },
    include: {
      contract: {
        select: {
          id: true,
          title: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function createPayment(userId: string, data: PaymentInput) {
  const contract = await prisma.contract.findFirst({
    where: { id: data.contractId, userId },
    select: { id: true },
  });
  if (!contract) throw new Error("Contract not found");

  return prisma.payment.create({
    data: {
      contractId: data.contractId,
      amountCents: data.amountCents,
      paidAt: data.paidAt,
      method: data.method,
      notes: data.notes,
    },
  });
}

export async function deletePayment(userId: string, id: string) {
  const result = await prisma.payment.deleteMany({
    where: { id, contract: { userId } },
  });
  if (result.count === 0) throw new Error("Payment not found");
}

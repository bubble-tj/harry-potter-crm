import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userId: string) {
  const [clientCount, offeringCount, activeContracts, recentPayments, contractAgg] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.offering.count({ where: { userId } }),
    prisma.contract.count({ where: { userId, status: "ACTIVE" } }),
    prisma.payment.findMany({
      where: { contract: { userId } },
      orderBy: { paidAt: "desc" },
      take: 5,
      include: {
        contract: { select: { id: true, title: true, client: { select: { name: true } } } },
      },
    }),
    prisma.contract.findMany({
      where: { userId, status: { in: ["ACTIVE", "DRAFT"] } },
      include: {
        items: { select: { quantity: true, priceCents: true } },
        payments: { select: { amountCents: true } },
      },
    }),
  ]);

  const outstanding = contractAgg.reduce((total, c) => {
    const sum = c.items.reduce((s, it) => s + it.quantity * it.priceCents, 0);
    const paid = c.payments.reduce((s, p) => s + p.amountCents, 0);
    return total + Math.max(sum - paid, 0);
  }, 0);

  return { clientCount, offeringCount, activeContracts, outstanding, recentPayments };
}

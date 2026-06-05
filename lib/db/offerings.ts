import { prisma } from "@/lib/prisma";
import type { OfferingInput } from "@/lib/validation/offerings";

export function listOfferings(userId: string) {
  return prisma.offering.findMany({
    where: { userId },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    include: { _count: { select: { contractItems: true } } },
  });
}

export function getOffering(userId: string, id: string) {
  return prisma.offering.findFirst({ where: { id, userId } });
}

export function createOffering(userId: string, data: OfferingInput) {
  return prisma.offering.create({ data: { userId, ...data } });
}

export async function updateOffering(userId: string, id: string, data: OfferingInput) {
  const result = await prisma.offering.updateMany({ where: { id, userId }, data });
  if (result.count === 0) throw new Error("Offering not found");
}

export async function deleteOffering(userId: string, id: string) {
  const result = await prisma.offering.deleteMany({ where: { id, userId } });
  if (result.count === 0) throw new Error("Offering not found");
}

export function listOfferingsForSelect(userId: string) {
  return prisma.offering.findMany({
    where: { userId },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: { id: true, name: true, priceCents: true, category: true },
  });
}

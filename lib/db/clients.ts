import { prisma } from "@/lib/prisma";
import type { ClientInput } from "@/lib/validation/clients";

export function listClients(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contracts: true } } },
  });
}

export function getClient(userId: string, id: string) {
  return prisma.client.findFirst({
    where: { id, userId },
    include: {
      contracts: {
        orderBy: { createdAt: "desc" },
        include: { items: true, payments: true },
      },
    },
  });
}

export function createClient(userId: string, data: ClientInput) {
  return prisma.client.create({
    data: { userId, ...data },
  });
}

export async function updateClient(userId: string, id: string, data: ClientInput) {
  const result = await prisma.client.updateMany({
    where: { id, userId },
    data,
  });
  if (result.count === 0) throw new Error("Client not found");
}

export async function deleteClient(userId: string, id: string) {
  const result = await prisma.client.deleteMany({ where: { id, userId } });
  if (result.count === 0) throw new Error("Client not found");
}

export function listClientsForSelect(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

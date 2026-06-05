import { PrismaClient, ContractStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "merlin@example.com";
  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      displayName: "Merlin Ambrosius",
      passwordHash,
    },
  });

  // Wipe demo user's existing data for idempotent reseed.
  await prisma.payment.deleteMany({ where: { contract: { userId: user.id } } });
  await prisma.contractItem.deleteMany({ where: { contract: { userId: user.id } } });
  await prisma.contract.deleteMany({ where: { userId: user.id } });
  await prisma.offering.deleteMany({ where: { userId: user.id } });
  await prisma.client.deleteMany({ where: { userId: user.id } });

  const [curse, flying, love, cleanKitchen] = await Promise.all([
    prisma.offering.create({
      data: {
        userId: user.id,
        name: "Curse your ex",
        description: "A bespoke hex tailored to your former beloved.",
        priceCents: 25000,
        category: "Curse",
      },
    }),
    prisma.offering.create({
      data: {
        userId: user.id,
        name: "One-hour flying spell",
        description: "Sixty minutes of confident, hands-free flight.",
        priceCents: 8000,
        category: "Enchantment",
      },
    }),
    prisma.offering.create({
      data: {
        userId: user.id,
        name: "Love enchantment",
        description: "Ethically dubious. Effective.",
        priceCents: 40000,
        category: "Enchantment",
      },
    }),
    prisma.offering.create({
      data: {
        userId: user.id,
        name: "Magically clean kitchen",
        description: "Self-scrubbing pots and pans for a week.",
        priceCents: 5000,
        category: "Service",
      },
    }),
  ]);

  const hermione = await prisma.client.create({
    data: {
      userId: user.id,
      name: "Hermione Granger",
      email: "h.granger@example.com",
      phone: "+44 20 7946 0958",
      notes: "Prefers ethical magic. Asks lots of questions.",
    },
  });

  const luna = await prisma.client.create({
    data: {
      userId: user.id,
      name: "Luna Lovegood",
      email: "luna@quibbler.test",
      notes: "Pays in moon-rocks. Allegedly.",
    },
  });

  const c1 = await prisma.contract.create({
    data: {
      userId: user.id,
      clientId: hermione.id,
      title: "Tidy the Burrow",
      status: ContractStatus.ACTIVE,
      startDate: new Date(),
      items: {
        create: [
          { offeringId: cleanKitchen.id, quantity: 2, priceCents: cleanKitchen.priceCents },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: { contractId: c1.id, amountCents: 5000, paidAt: new Date(), method: "Sickles" },
  });

  await prisma.contract.create({
    data: {
      userId: user.id,
      clientId: luna.id,
      title: "Curse the Crumple-Horned Snorkack debunker",
      status: ContractStatus.DRAFT,
      notes: "Awaiting moon-rock delivery.",
      items: {
        create: [
          { offeringId: curse.id, quantity: 1, priceCents: curse.priceCents },
          { offeringId: flying.id, quantity: 1, priceCents: flying.priceCents },
        ],
      },
    },
  });

  console.log(`Seeded demo user: ${email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

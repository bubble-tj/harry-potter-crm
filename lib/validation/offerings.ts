import { z } from "zod";

export const offeringInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(5000).optional().or(z.literal("").transform(() => undefined)),
  priceCents: z.number().int().min(0, "Price cannot be negative").max(100_000_000),
  category: z.string().trim().max(60).optional().or(z.literal("").transform(() => undefined)),
});

export type OfferingInput = z.infer<typeof offeringInputSchema>;

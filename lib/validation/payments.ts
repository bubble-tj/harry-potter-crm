import { z } from "zod";

export const paymentInputSchema = z.object({
  contractId: z.string().min(1),
  amountCents: z.number().int().min(1, "Amount must be greater than zero").max(1_000_000_000),
  paidAt: z
    .string()
    .trim()
    .min(1, "Date is required")
    .transform((s) => new Date(s))
    .refine((d) => !Number.isNaN(d.getTime()), { message: "Invalid date" }),
  method: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export type PaymentInput = z.infer<typeof paymentInputSchema>;

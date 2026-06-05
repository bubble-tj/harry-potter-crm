import { z } from "zod";
import { ContractStatus } from "@prisma/client";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((s) => (s ? new Date(s) : undefined))
  .refine((d) => d === undefined || !Number.isNaN(d.getTime()), { message: "Invalid date" });

export const contractCreateSchema = z.object({
  clientId: z.string().min(1, "Pick a client"),
  title: z.string().trim().min(1, "Title is required").max(160),
  status: z.nativeEnum(ContractStatus).default(ContractStatus.DRAFT),
  startDate: optionalDate,
  dueDate: optionalDate,
  notes: z.string().trim().max(5000).optional().or(z.literal("").transform(() => undefined)),
  items: z
    .array(
      z.object({
        offeringId: z.string().min(1),
        quantity: z.number().int().min(1).max(1000),
      }),
    )
    .min(1, "Add at least one offering"),
});

export type ContractCreateInput = z.infer<typeof contractCreateSchema>;

export const contractUpdateSchema = contractCreateSchema.omit({ items: true });
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;

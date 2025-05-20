import { z } from "zod";

export const checkShopResponeSchema = z.object({
  code: z.number(),
  result: z.boolean(),
});

export type CheckShopResponse = z.infer<typeof checkShopResponeSchema>;

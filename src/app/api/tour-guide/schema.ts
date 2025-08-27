import { z } from "zod";

export const tripSchema = z.object({
  city: z.string(),
  duration: z.string(),
  explore: z.array(z.string()),
  packingList: z.array(z.string()),
});

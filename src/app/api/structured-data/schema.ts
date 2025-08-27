import { z } from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingrediant: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      })
    ),
    steps: z.array(z.string()),
  }),
});

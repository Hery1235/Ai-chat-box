import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
  const { dish, age } = await req.json();
  console.log("The dish name is", age);
  try {
    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: recipeSchema,
      prompt: `Generate Recipe for ${dish}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return new Response("Error while generation", { status: 500 });
  }
}

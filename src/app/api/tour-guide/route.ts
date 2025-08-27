import { tripSchema } from "./schema";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export async function POST(req: Request) {
  const { city, duration } = await req.json();
  try {
    console.log("city is ", city);
    console.log("city is ", duration);
    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      prompt: `Creata a trip plan for ${city} duration of ${duration} days`,
      schema: tripSchema,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error while generating", error);
    return new Response("Error while generating", { status: 500 });
  }
}

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json(); // frontend sends { prompt: "..." }
    console.log("The prompt is ", prompt);
    const response = streamText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    return response.toUIMessageStreamResponse();
    // or: response.toDataStreamResponse();
    // or: response.toUIStreamResponse(); depending on what you want
  } catch (error) {
    console.error("API error:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}

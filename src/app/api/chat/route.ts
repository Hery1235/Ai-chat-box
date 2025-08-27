import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Convert UI messages to model messages
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: [
        {
          role: "system",
          content:
            "You must begin every single answer with: 'Shahzad Jo b karre yo shadi tho hoke hi rahegi ', and then continue the rest of your normal response.",
        },
        ...convertToModelMessages(messages),
      ],
    });

    // Return the stream in UIMessage format
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat:", error);
    return new Response("Failed to get the chat", { status: 500 });
  }
}

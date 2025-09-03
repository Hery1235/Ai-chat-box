import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const tools = {
  getPerson: tool({
    description: "A person name for telling his address",
    inputSchema: z.object({
      name: z.string(),
    }),
    execute: ({ name }) => {
      if (name === "haris") return "London";
      else if (name === "asim") return "Australia";
      else if (name === "tauseef") return "Dubai";
      else if (name === "ramiz") return "Pakistan";
      else throw Error("Sorry we are not aware of this person ");
    },
  }),
  weather: tool({
    description: "Weather for a city",
    inputSchema: z.object({
      city: z.string(),
    }),
    execute: ({ city }) => {
      if (city === "London") return "Good";
      else if (city === "Australia") return "Normal";
      else if (city === "Dubai") return "Very Hot";
      else if (city === "Pakistan") return "Hot";
      else throw Error("Sorry we are not aware of this City ");
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // Convert UI messages to model messages
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(3),
    });

    console.log(result.toUIMessageStreamResponse());
    // Return the stream in UIMessage format
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat:", error);
    return new Response("Failed to get the chat", { status: 500 });
  }
}

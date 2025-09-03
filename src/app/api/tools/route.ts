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
  weather: tool({
    description: "Get the weather in a location",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      if (location === "error") {
        throw new Error("Weather not available");
      }

      return {
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      };
    },
  }),
  currencyConverter: tool({
    description: "Convert pounds to Pakistani Rupees",
    inputSchema: z.object({
      pounds: z.number(),
    }),
    execute: ({ pounds }) => {
      if (pounds > 1000) {
        throw new Error("Need Money Laundering Check ");
      } else if (pounds >= 200) {
        return `${pounds} pounds into 400 = ${pounds * 400} Pak Rupees `;
      } else {
        return `${pounds} pounds into 300 = ${pounds * 300} Pak Rupees `;
      }
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
      stopWhen: stepCountIs(2),
    });

    console.log(result.toUIMessageStreamResponse());
    // Return the stream in UIMessage format
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat:", error);
    return new Response("Failed to get the chat", { status: 500 });
  }
}

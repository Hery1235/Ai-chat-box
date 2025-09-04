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
  // getPerson: tool({
  //   description: "A person name for telling his address",
  //   inputSchema: z.object({
  //     name: z.string(),
  //   }),
  //   execute: ({ name }) => {
  //     if (name === "haris") return "London";
  //     else if (name === "asim") return "Australia";
  //     else if (name === "tauseef") return "Dubai";
  //     else if (name === "ramiz") return "Pakistan";
  //     else throw Error("Sorry we are not aware of this person ");
  //   },
  // }),
  weather: tool({
    description: "Weather for a city",
    inputSchema: z.object({
      city: z.string(),
    }),
    execute: async ({ city }) => {
      if (!city || city.toLowerCase().includes("shaidu")) {
        return "No city found";
      } else {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=e41837c54b6b4d2295372349250309 &q=${city}&aqi=no`
        );
        if (!response.ok) {
          return "Error while finding data from weather api";
        }
        const data = await response.json();
        return data.current.temp_c;
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

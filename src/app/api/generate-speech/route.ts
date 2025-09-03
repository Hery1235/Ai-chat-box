import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
      voice: "alloy",
    });

    return new Response(audio.uint8Array, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error while generating audio", error);
    return new Response("Error while generating audio", { status: 500 });
  }
}

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (prompt.includes("shahzad")) {
      const reply = "Kona d verkere kana bia rale ";
      return Response.json(
        { error: "Te bia rale ase b rabande da zan oghay kha" },
        { status: 500 }
      );
    }
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });
    return Response.json({ text });
  } catch (error) {
    console.error("Error while generating text ", error);
    return Response.json({ error: "Error while generatin" }, { status: 500 });
  }
}

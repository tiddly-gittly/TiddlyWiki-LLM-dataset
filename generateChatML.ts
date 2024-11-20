import { join } from "@std/path";
import type {} from "tw5-typed";
import { TiddlyWiki } from "tiddlywiki";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("DEEPSEEK_API_KEY"),
  baseURL: "https://api.deepseek.com",
});

const wikiInstance = TiddlyWiki();
const wikiPath = join(Deno.cwd(), "wiki");
wikiInstance.boot.argv = [wikiPath, "--version"];
wikiInstance.boot.startup({});

export async function generateChatML(tidContent: string): Promise<string> {
  const dataPromptTiddlers = wikiInstance.wiki.filterTiddlers(
    `[!is[system]tag[Prompt]tag[Data]]`,
  )
    .map((title) => wikiInstance.wiki.getTiddler(title))
    .filter((tiddler) => tiddler !== undefined)
    .filter((tiddler) => tiddler.fields.prompt !== undefined);

  const chatmlContents = await Promise.all(
    dataPromptTiddlers.map(async (tiddler) => {
      const prompt = tiddler.fields.prompt as string;
      const AIOutput = await callLLM(prompt, tidContent);
      const chatmlContent = wikiInstance.wiki.renderTiddler(
        "text/plain",
        tiddler.fields.title,
        {
          variables: {
            prompt,
            AIOutput,
          },
        },
      );
      return chatmlContent;
    }),
  );

  // 合并所有消息
  return chatmlContents.join("");
}

async function callLLM(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  console.log("Calling LLM with systemPrompt:", systemPrompt);
  console.log("Calling LLM with userPrompt:", userPrompt);

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    "stream": false,
  });

  const assistantMessage = completion.choices[0]?.message?.content || "";
  console.log("Received assistantMessage:", assistantMessage);
  return assistantMessage;
}

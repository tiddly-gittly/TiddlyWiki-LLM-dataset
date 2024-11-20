import { join } from "@std/path";
import "tw5-typed";
import { TiddlyWiki } from "tiddlywiki";

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

  const chatmlContents = await Promise.all(dataPromptTiddlers.map(async (tiddler) => {
    const prompt = tiddler.fields.prompt as string;
    const AIOutput = await callLLM(prompt, tidContent);
    const chatmlContent = wikiInstance.wiki.renderTiddler("text/plain", tiddler.fields.title, {
      variables: {
        prompt,
        AIOutput,
      }
    })
    return chatmlContent;
  }))
  

  // 合并所有消息
  return chatmlContents.join("");
}

async function callLLM(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  // 调用 LLM API 的逻辑，提取为可替换的函数
  // ...implementation...
  return ""; // 返回助手的回复
}

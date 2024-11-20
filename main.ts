import { ensureDir } from '@std/fs';
import { join, extname, relative, dirname } from '@std/path';
import { generateChatML } from './generateChatML.ts';

async function readTidFilesAndCreateChatML(folderPath: string) {
  const dataFolderPath = join('data', folderPath);
  const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

  async function processFolder(currentPath: string) {
    const files = Deno.readDir(currentPath);

    for await (const file of files) {
      const fullPath = join(currentPath, file.name);
      const statResult = await Deno.stat(fullPath);

      if (statResult.isDirectory) {
        await processFolder(fullPath);
      } else if (extname(file.name) === '.tid') {
        const relativePath = relative(folderPath, fullPath);
        const chatmlFilePath = join(dataFolderPath, relativePath.replace('.tid', `.${currentDate}.chatml`));

        try {
          await Deno.stat(chatmlFilePath);
        } catch {
          const tidContent = await Deno.readTextFile(fullPath);
          const chatmlContent = await generateChatML(tidContent);
          await ensureDir(dirname(chatmlFilePath));
          await Deno.writeTextFile(chatmlFilePath, chatmlContent);
        }
      }
    }
  }

  await processFolder(folderPath);
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  // 调用 LLM API 的逻辑，提取为可替换的函数
  // ...implementation...
  return ''; // 返回助手的回复
}

if (import.meta.main) {
  const folderPath = join(Deno.cwd(), '..', 'TiddlyWiki5');
  readTidFilesAndCreateChatML(folderPath);
}
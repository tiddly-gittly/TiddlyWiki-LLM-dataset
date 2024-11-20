import { ensureDir } from "@std/fs";
import { dirname, extname, join, relative } from "@std/path";
import { generateChatML } from "./generateChatML.ts";

async function readTidFilesAndCreateChatML(folderPath: string) {
  const dataFolderPath = join(Deno.cwd(), "data");
  const basePath = join(Deno.cwd(), "..");
  const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "");

  async function processFolder(currentPath: string) {
    const files = Deno.readDir(currentPath);

    for await (const file of files) {
      const fullPath = join(currentPath, file.name);
      const statResult = await Deno.stat(fullPath);

      if (extname(file.name) === ".tid") {
        const fileName = relative(folderPath, fullPath);
        const relativePath = relative(basePath, currentPath);
        const chatmlFilePath = join(
          dataFolderPath,
          relativePath,
          fileName.replace(".tid", `.${currentDate}.chatml`),
        );

        try {
          await Deno.stat(chatmlFilePath);
        } catch {
          const tidContent = await Deno.readTextFile(fullPath);
          const chatmlContent = await generateChatML(tidContent);
          await ensureDir(dirname(chatmlFilePath));
          await Deno.writeTextFile(chatmlFilePath, chatmlContent);
        }
      } else if (statResult.isDirectory) {
        await processFolder(fullPath);
      }
    }
  }

  await processFolder(folderPath);
}

const subFolder = "core/wiki/config/ui";
if (import.meta.main) {
  const folderPath = join(
    Deno.cwd(),
    "..",
    "TiddlyWiki5",
    ...subFolder.split("/"),
  );
  readTidFilesAndCreateChatML(folderPath);
}

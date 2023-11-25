import path from "node:path";
import fs from "node:fs";

export class StaticFileHandler {
  renderFileContent(filename: string) {
    if (!require.main?.filename) {
      return;
    }
    const filePath = path.join(require.main?.filename, "../static/", filename);
    const file = fs.readFileSync(filePath);

    return file;
  }
}

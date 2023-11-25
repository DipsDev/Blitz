import path from "node:path";
import fs from "node:fs";

export class StaticFileHandler {
  renderFileContent(filename: string, data?: Record<string, string>) {
    if (!require.main?.filename) {
      return;
    }
    if (!path.extname(filename)) {
      filename += ".dhtml";
    }
    const filePath = path.join(require.main?.filename, "../static/", filename);
    const file = fs.readFileSync(filePath);

    if (
      !path.extname(filename) ||
      (path.extname(filename) === ".dhtml" && data)
    ) {
      return this.renderDynamicFileContent(
        file,
        data as Record<string, string>
      );
    }

    return file;
  }
  private renderDynamicFileContent(file: Buffer, data: Record<string, string>) {
    const string = file.toString("utf-8");
    const replacedHtml = string.replace(/(::*\S[^<!>/\\:]*)/g, function (m) {
      if (m.replace("::", "") in data) {
        return data[m.replace("::", "")];
      }
      return m;
    });

    return replacedHtml;
  }
}

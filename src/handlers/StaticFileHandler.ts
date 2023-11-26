import path from "node:path";
import fs from "node:fs";

export class StaticFileHandler {
  isFileExists(path: string) {
    return fs.existsSync(path);
  }

  defaultFallback() {
    return "<head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body>";
  }

  renderFileContent(filename: string, data?: Record<string, string>) {
    if (!require.main?.filename) {
      return;
    }
    if (!path.extname(filename)) {
      filename += ".dhtml";
    }
    const filePath = path.join(require.main?.filename, "../views/", filename);
    if (!this.isFileExists(filePath)) {
      return this.defaultFallback();
    }
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
    const replacedHtml = string.replace(/(::[^</:\/ +-/!]*)/g, function (m) {
      if (m.replace("::", "") in data) {
        return data[m.replace("::", "")];
      }
      return m;
    });

    return replacedHtml;
  }
}

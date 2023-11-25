import { IncomingMessage, ServerResponse } from "http";
import fs from "node:fs";
import path from "path";
import { StaticFileHandler } from "../handlers/StaticFileHandler";

export default class BlitzResponse<
  Request extends IncomingMessage = IncomingMessage
> extends ServerResponse<Request> {
  constructor(req: Request) {
    super(req);
  }

  json(data: object) {
    // Return json object
    const json = JSON.stringify(data);
    this.setHeader("Content-Type", "application/json");
    this.setHeader("Content-Length", Buffer.byteLength(json));
    return this.end(json);
  }
  status(statusCode: number) {
    // Set the status code of the response
    this.statusCode = statusCode;
    return this;
  }
  view(filename: string, data?: Record<string, string>) {
    const fileHandler = new StaticFileHandler();
    if (!require.main?.filename) {
      return this.end("Unexpected Error");
    }
    return this.end(fileHandler.renderFileContent(filename, data));
  }
}

import { IncomingMessage, ServerResponse } from "http";
import fs from "node:fs";

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
  view(filename: string) {
    const file = fs.readFileSync(filename);
    return this.end(file);
  }
}

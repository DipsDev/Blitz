import type { ServerResponse, IncomingMessage } from "http";
import { RouteHandler, ServerModes } from "../server";
import BlitzResponse from "../types/BlitzResponse";

type OutgoingResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

export class RequestHandler {
  routers: Record<string, RouteHandler>; // GET:Hello
  mode: ServerModes;
  constructor(routers: Record<string, RouteHandler>, mode: ServerModes) {
    this.routers = routers;
    this.mode = mode;
  }

  private formatIncomingMessage(req: IncomingMessage) {
    if (req.url?.endsWith("/")) {
      return `${req.method}::${req.url.substring(0, req.url.length - 1)}`;
    }
    return `${req.method}::${req.url}`;
  }

  handle(req: IncomingMessage, res: OutgoingResponse) {
    const formmatted = this.formatIncomingMessage(req);
    if (formmatted in this.routers) {
      if (this.mode === ServerModes.JSONIFY) {
        // Return json as default
        const json = JSON.stringify(
          this.routers[formmatted](
            req,
            Object.setPrototypeOf(res, BlitzResponse.prototype)
          )
        );
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", Buffer.byteLength(json));
        return res.end(json);
      } else {
        return this.routers[formmatted](
          req,
          Object.setPrototypeOf(res, BlitzResponse.prototype)
        );
      }
    } else {
      return res.writeHead(404).end();
    }
  }
}

import type { ServerResponse, IncomingMessage } from "http";
import { RouteHandler, ServerModes } from "../server";
import BlitzResponse from "../types/BlitzResponse";
import { StaticFileHandler } from "./StaticFileHandler";
import { RouteTrie } from "../types/RouteTrie";

type OutgoingResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

export class RequestHandler {
  private routers: Record<string, RouteHandler>; // GET:Hello
  private mode: ServerModes;
  private routerTree: RouteTrie;
  constructor(
    routers: Record<string, RouteHandler>,
    routerTree: RouteTrie,
    mode: ServerModes
  ) {
    this.routers = routers;
    this.mode = mode;
    this.routerTree = routerTree;
  }

  handle(req: IncomingMessage, res: OutgoingResponse) {
    const route = this.routerTree.fetchRoute(req.url as string);
    const formmatted = `${req.method}::${route.path}`;
    if (route.found) {
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
      // Trying to access 404.dhtml
      const staticFile = new StaticFileHandler();
      const file = staticFile.renderFileContent("404");
      return res.writeHead(404).end(file);
    }
  }
}

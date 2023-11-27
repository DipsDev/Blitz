import type { ServerResponse, IncomingMessage } from "http";
import { RouteHandler, ServerModes } from "../server";
import BlitzResponse from "../types/BlitzResponse";
import { StaticFileHandler } from "./StaticFileHandler";
import { FetchedRoute, RouteTrie } from "../types/RouteTrie";
import BlitzRequest from "../types/BlitzRequest";

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

  private handlePostRequest(
    req: IncomingMessage,
    res: OutgoingResponse,
    route: FetchedRoute
  ) {
    const request = new BlitzRequest(req.socket, route);
    const formmatted = `${req.method}::${route.path}`;
    const self = this;

    var body = "";
    req.on("data", function (chunk) {
      body += chunk;
    });

    req.on("error", (err) => {
      return res.writeHead(500, err.message);
    });

    req.on("end", function () {
      request.body = JSON.parse(body);
      if (self.mode === ServerModes.JSONIFY) {
        const json = JSON.stringify(
          self.routers[formmatted](
            request,
            Object.setPrototypeOf(res, BlitzResponse.prototype)
          )
        );
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", Buffer.byteLength(json));
        return res.end(json);
      } else {
        return self.routers[formmatted](
          request,
          Object.setPrototypeOf(res, BlitzResponse.prototype)
        );
      }
    });
  }

  private handleGetRequest(
    req: IncomingMessage,
    res: OutgoingResponse,
    route: FetchedRoute
  ) {
    const request = new BlitzRequest(req.socket, route);
    const formmatted = `${req.method}::${route.path}`;

    if (this.mode === ServerModes.JSONIFY) {
      const json = JSON.stringify(
        this.routers[formmatted](
          request,
          Object.setPrototypeOf(res, BlitzResponse.prototype)
        )
      );
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Length", Buffer.byteLength(json));
      return res.end(json);
    } else {
      return this.routers[formmatted](
        request,
        Object.setPrototypeOf(res, BlitzResponse.prototype)
      );
    }
  }

  handle(req: IncomingMessage, res: OutgoingResponse) {
    const route = this.routerTree.fetchRoute(req.url as string);

    if (route.found) {
      try {
        if (req.method === "GET") {
          return this.handleGetRequest(req, res, route);
        }
        return this.handlePostRequest(req, res, route);
      } catch (err) {
        return res.writeHead(500, "505 Unexpected Server Error");
      }
    } else {
      // Trying to access 404.dhtml
      const staticFile = new StaticFileHandler();
      const file = staticFile.renderFileContent("404");
      return res.writeHead(404).end(file);
    }
  }
}

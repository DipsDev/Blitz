import type { ServerResponse, IncomingMessage } from "http";
import { MiddlewareConsumer, RouteHandler, ServerModes } from "../server";
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
  private middlewares: MiddlewareConsumer[];
  constructor(
    routers: Record<string, RouteHandler>,
    middlewares: MiddlewareConsumer[],
    routerTree: RouteTrie,
    mode: ServerModes
  ) {
    this.routers = routers;
    this.middlewares = middlewares;
    this.mode = mode;
    this.routerTree = routerTree;
  }

  private handlePostRequest(request: BlitzRequest, res: OutgoingResponse) {
    const formmatted = `${request.method}::${request.strictPath}`;
    const self = this;

    var body = "";
    request.on("data", function (chunk) {
      body += chunk;
    });

    request.on("error", (err) => {
      return res.writeHead(500, err.message);
    });

    request.on("end", function () {
      request.body = JSON.parse(body);
      if (self.mode === ServerModes.JSONIFY) {
        const json = JSON.stringify(
          self.callRouterCallback(
            formmatted,
            request,
            Object.setPrototypeOf(res, BlitzResponse.prototype)
          )
        );
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", Buffer.byteLength(json));
        return res.end(json);
      } else {
        return self.callRouterCallback(
          formmatted,
          request,
          Object.setPrototypeOf(res, BlitzResponse.prototype)
        );
      }
    });
  }

  private handleGetRequest(req: BlitzRequest, res: OutgoingResponse) {
    const formmatted = `${req.method}::${req.strictPath}`;
    if (this.mode === ServerModes.JSONIFY) {
      const json = JSON.stringify(
        this.callRouterCallback(
          formmatted,
          req,
          Object.setPrototypeOf(res, BlitzResponse.prototype)
        )
      );
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Length", Buffer.byteLength(json));
      return res.end(json);
    } else {
      return this.callRouterCallback(
        formmatted,
        req,
        Object.setPrototypeOf(res, BlitzResponse.prototype)
      );
    }
  }

  private callRouterCallback(
    formmatted: string,
    request: BlitzRequest,
    res: OutgoingResponse
  ) {
    try {
      return this.routers[formmatted](
        request,
        Object.setPrototypeOf(res, BlitzResponse.prototype)
      );
    } catch (err) {
      res.writeHead(500).end("505 Unexpected Error");
      console.error(err);
      return {};
    }
  }

  handle(req: IncomingMessage, res: OutgoingResponse) {
    const route = this.routerTree.fetchRoute(req.url as string);
    const request = new BlitzRequest(req, route);
    const formmatted = `${req.method}::${route.path}`;

    if (route.found && formmatted in this.routers) {
      // call middleware
      for (const middleware of this.middlewares) {
        const result = middleware(request, res);
        if (result) {
          return result;
        }
      }
      if (req.method === "GET") {
        return this.handleGetRequest(request, res);
      }
      return this.handlePostRequest(request, res);
    } else {
      // Trying to access 404.dhtml
      const staticFile = new StaticFileHandler();
      const file = staticFile.renderFileContent("404");
      return res.writeHead(404).end(file);
    }
  }
}

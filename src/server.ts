import http from "http";
import BlitzResponse from "./types/BlitzResponse";
import { RequestHandler } from "./handlers/RequestHandler";
import { RouteTrie } from "./types/RouteTrie";
import BlitzRequest from "./types/BlitzRequest";
export type RouteHandler = (req: BlitzRequest, res: BlitzResponse) => any;

export enum ServerModes {
  NORMAL,
  JSONIFY,
}

class BlitzServer {
  private routers: Record<string, RouteHandler> = {}; // GET:Hello
  private routeTree = new RouteTrie();
  private mode: ServerModes = ServerModes.NORMAL;
  async listen(port: number, onListen?: () => void) {
    const requestHandler = new RequestHandler(
      this.routers,
      this.routeTree,
      this.mode
    );

    const hserv = http.createServer();
    hserv.addListener("request", (rq, rs) => requestHandler.handle(rq, rs));
    hserv.listen(port, () => {
      console.log(
        `Blitz server is running on port http://localhost:${port} (Ctrl + C to exit process)`
      );

      if (onListen) {
        onListen();
      }
    });
  }
  getTestingServer() {
    const requestHandler = new RequestHandler(
      this.routers,
      this.routeTree,
      this.mode
    );
    const hserv = http.createServer();
    hserv.addListener("request", (rq, rs) => requestHandler.handle(rq, rs));
    return hserv;
  }
  jsonify() {
    this.mode = ServerModes.JSONIFY;
    return this;
  }
  async get(route: string, handler: RouteHandler) {
    this.routers[`GET::${route}`] = handler;
    this.routeTree.addRoute(route);
  }

  async post(route: string, handler: RouteHandler) {
    this.routers[`POST::${route}`] = handler;
    this.routeTree.addRoute(route);
  }
}

export default function blitz() {
  return new BlitzServer();
}

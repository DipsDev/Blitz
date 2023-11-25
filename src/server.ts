import http from "http";
import BlitzResponse from "./types/BlitzResponse";
import { RequestHandler } from "./handlers/RequestHandler";
export type RouteHandler = (
  req: http.IncomingMessage,
  res: BlitzResponse
) => any;

export enum ServerModes {
  NORMAL,
  JSONIFY,
}

class BlitzServer {
  private routers: Record<string, RouteHandler> = {}; // GET:Hello
  private mode: ServerModes = ServerModes.NORMAL;
  async listen(port: number, onListen?: () => void) {
    const requestHandler = new RequestHandler(this.routers, this.mode);

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
    const requestHandler = new RequestHandler(this.routers, this.mode);
    const hserv = http.createServer();
    hserv.addListener("request", (rq, rs) => requestHandler.handle(rq, rs));
    return hserv;
  }
  jsonify() {
    this.mode = ServerModes.JSONIFY;
    return this;
  }
  async request(method: string, handler: RouteHandler) {
    this.routers[method] = handler;
  }
}

export default function blitz() {
  return new BlitzServer();
}

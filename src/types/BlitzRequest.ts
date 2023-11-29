import { IncomingMessage } from "http";
import { Socket } from "net";
import { FetchedRoute } from "./RouteTrie";
export default class BlitzRequest extends IncomingMessage {
  params: string[];
  strictPath: string;
  body?: any;
  method?: string;
  constructor(req: IncomingMessage, fetched: FetchedRoute) {
    super(req.socket);
    this.method = req.method;
    this.params = fetched.params;
    this.strictPath = fetched.path;
  }
}

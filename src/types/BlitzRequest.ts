import { IncomingMessage } from "http";
import { Socket } from "net";
import { FetchedRoute } from "./RouteTrie";
export default class BlitzRequest extends IncomingMessage {
  params: string[];
  strictPath: string;
  constructor(req: Socket, fetched: FetchedRoute) {
    super(req);
    this.params = fetched.params;
    this.strictPath = fetched.path;
  }
}

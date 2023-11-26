/*

    <tree>
  a   b  c
 *   b 


*/

class RouteNode {
  children: Record<string, RouteNode>;
  endOfRoute: boolean;
  constructor(endOfRoute = false) {
    this.children = {};
    this.endOfRoute = endOfRoute;
  }
}

export class RouteTrie {
  private head: RouteNode;
  constructor() {
    this.head = new RouteNode();
  }
  private removeStartingSlash(path: string) {
    if (path[0] === "/") {
      return path.substring(1);
    }
    return path;
  }
  addRoute(path: string) {
    path = this.removeStartingSlash(path);
    const splittedPath = path.split("/").reverse();
    let node = this.head;
    while (splittedPath.length > 0) {
      let curr = splittedPath.pop() as string;
      if (!(curr in node.children)) {
        node.children[curr] = new RouteNode();
      }
      node = node.children[curr];
    }
    node.endOfRoute = true;
  }
  fetchRoute(path: string) {
    path = this.removeStartingSlash(path);
    const splittedPath = path.split("/");
    splittedPath.reverse();
    let node = this.head;

    let constructedPath = "";

    while (splittedPath.length > 0) {
      let curr = splittedPath.pop() as string;

      if (!(curr in node.children)) {
        if (!("*" in node.children)) {
          return "";
        }
        curr = "*";
      }
      constructedPath += `/${curr}`;
      node = node.children[curr];
    }
    return constructedPath;
  }

  routeExists(path: string): boolean {
    path = this.removeStartingSlash(path);
    const splittedPath = path.split("/");
    splittedPath.reverse();
    let node = this.head;

    while (splittedPath.length > 0) {
      let curr = splittedPath.pop() as string;

      if (!(curr in node.children)) {
        if (!("*" in node.children)) {
          return false;
        }
        curr = "*";
      }

      node = node.children[curr];
    }

    return node.endOfRoute;
  }
}

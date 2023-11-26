/*

    <tree>
  a   b  c
 *   b 


*/

export interface FetchedRoute {
  path: string;
  params: string[];
  found: boolean;
}

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
  private removeSlashes(path: string) {
    if (path[0] === "/") {
      path = path.substring(1);
    }
    if (path[path.length - 1] === "/") {
      path = path.substring(0, path.length - 1);
    }
    return path;
  }
  addRoute(path: string) {
    path = this.removeSlashes(path);
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
  fetchRoute(path: string): FetchedRoute {
    path = this.removeSlashes(path);
    const splittedPath = path.split("/");
    splittedPath.reverse();
    let node = this.head;

    let constructedPath = "";
    const params = [];

    while (splittedPath.length > 0) {
      let curr = splittedPath.pop() as string;
      if (!(curr in node.children)) {
        if (!("*" in node.children)) {
          return {
            path: "",
            params: [],
            found: false,
          };
        }
        params.push(curr);
        curr = "*";
      }
      constructedPath += `/${curr}`;
      node = node.children[curr];
    }
    if (node.endOfRoute)
      return {
        path: constructedPath,
        params,
        found: true,
      };
    return {
      path: "",
      params: [],
      found: false,
    };
  }

  routeExists(path: string): boolean {
    path = this.removeSlashes(path);
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

import { RouteTrie } from "../types/RouteTrie";

describe("Route Trie Should Work", () => {
  let trie: RouteTrie;
  beforeEach(() => {
    trie = new RouteTrie();
  });
  it("Should be able to add routes", () => {
    trie.addRoute("/a/b");

    // simple route exists
    expect(trie.routeExists("/a/b")).toBeTruthy();

    // falsy route exists
    expect(trie.routeExists("/a/c")).toBeFalsy();

    // checking middle of route
    expect(trie.routeExists("/a")).toBeFalsy();

    // should handle ending /
    expect(trie.routeExists("/a/b/")).toBeTruthy();
  });
  it("Should be able to find with asteriks", () => {
    trie.addRoute("/b/*");
    // Check if the asteriks are correct
    expect(trie.routeExists("/b/a")).toBeTruthy();

    // check if the route fetch is correct
    expect(trie.fetchRoute("/b/a")).toEqual({
      path: "/b/*",
      params: ["a"],
      found: true,
    });

    // check if fetch route returns empty string of not found
    // /b and /b/* consider different routes
    expect(trie.fetchRoute("/b")).toEqual({
      path: "",
      params: [],
      found: false,
    });
  });
  it("Should be able to find with placeholders and non placeholders", () => {
    trie.addRoute("/b/*/a");

    // check if matches middle placeholders
    expect(trie.routeExists("/b/abc/a")).toBeTruthy();

    // check if the system treats /b/* and /b/*/a different
    expect(trie.routeExists("/b/abc")).toBeFalsy();
    expect(trie.fetchRoute("/b/abc")).toEqual({
      path: "",
      params: [],
      found: false,
    });

    // check if middle placeholders are caught correctly in fetchRoute
    expect(trie.fetchRoute("/b/abc/a")).toEqual({
      path: "/b/*/a",
      params: ["abc"],
      found: true,
    });
  });
  it("Should work with multi placeholders", () => {
    trie.addRoute("/b/*/*/a");

    expect(trie.routeExists("/b/a/a/a")).toBeTruthy();
    expect(trie.routeExists("/b/a/a")).toBeFalsy();

    expect(trie.fetchRoute("/b/abc/abc/a")).toEqual({
      path: "/b/*/*/a",
      params: ["abc", "abc"],
      found: true,
    });
  });
  it("Should work with special edge cases", () => {
    trie.addRoute("/a/*/b");
    trie.addRoute("/a/*/b"); // Shouldn't do any thing!

    expect(trie.routeExists("/a/b")).toBeFalsy();
    expect(trie.fetchRoute("/a/b")).toEqual({
      path: "",
      found: false,
      params: [],
    });
  });
});

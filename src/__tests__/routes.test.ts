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
  });
  it("Should be able to find with asteriks", () => {
    trie.addRoute("/b/*");
    // Check if the asteriks are correct
    expect(trie.routeExists("/b/a")).toBeTruthy();

    // check if the route fetch is correct
    expect(trie.fetchRoute("/b/a")).toBe("/b/*");

    // check if fetch route returns empty string of not found
    expect(trie.fetchRoute("/bb")).toBe("");
  });
  it("Should be able to find with placeholders and non placeholders", () => {
    trie.addRoute("/b/*/a");

    // check if matches middle placeholders
    expect(trie.routeExists("/b/abc/a")).toBeTruthy();

    // check if middle placeholders are caught correctly in fetchRoute
    expect(trie.fetchRoute("/b/abc/a")).toBe("/b/*/a");
  });
  it("Should work with multi placeholders", () => {
    trie.addRoute("/b/*/*/a");

    expect(trie.routeExists("/b/a/a/a")).toBeTruthy();

    expect(trie.fetchRoute("/b/abc/abc/a")).toBe("/b/*/*/a");
  });
});

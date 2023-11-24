import blitz from "../server";
import http from "http";

const app = blitz();

app.request("GET::/app", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

export const testServer = app.test();

import blitz from "../server";

const app = blitz();

app.request("GET::/hello", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

export const testServer = app.getTestingServer();

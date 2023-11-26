import blitz from "../server";

const app = blitz();

app.get("/hello", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

app.get("/static/hello", (req, res) => {
  return res.view("index", {
    bestFramework: "blitz",
  }); // Automatic Load from /views/
});

export const testServer = app.getTestingServer();

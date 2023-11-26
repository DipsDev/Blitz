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

// app.listen(3000);

export const testServer = app.getTestingServer();

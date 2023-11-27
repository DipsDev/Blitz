import blitz from "../server";

const app = blitz();

// Sending JSON
app.get("/hello", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

// Static rendering
app.get("/static/hello", (req, res) => {
  return res.view("index", {
    bestFramework: "blitz",
  }); // Automatic Load from /views/
});

// Static rendering + dynamic params
app.get("/*/*", (req, res) => {
  return res.view("params", {
    first: req.params[0],
    second: req.params[1],
    path: req.strictPath,
  });
});

app.post("/simple-post", (req, res) => {
  return res.json(req.body);
});

// app.listen(3000);

export const testServer = app.getTestingServer();

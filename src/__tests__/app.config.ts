import blitz from "../server";

const app = blitz();

app.use((req, res) => {
  res.setHeader("Web-Server", "blitz");
  // set the status code as you'd like
  // res.statusCode = 400;
  // throw an error with a message!
});

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

app.post("/*/*", (req, res) => {
  return res.json({
    a: `${req.params[0]}${req.body.shuffix}`,
    b: `${req.params[1]}${req.body.shuffix}`,
  });
});

app.post("/convert-to-number", (req, res) => {
  console.log(req.body.calculateNumbers()); // no function -> should throw an error 500
  return res.json({
    result: Number(req.body.a) / Number(req.body.b),
  });
});

app.post("/simple-post", (req, res) => {
  return res.json(req.body);
});

// app.listen(3000);

export const testServer = app.getTestingServer();

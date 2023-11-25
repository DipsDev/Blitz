import blitz from "../server";

const app = blitz({
  static: {
    viewsDir: "/test/views",
  },
});

app.request("GET::/hello", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

app.request("GET::/static/hello", (req, res) => {
  return res.view("index.html");
});

app.listen(3000);

export const testServer = app.getTestingServer();

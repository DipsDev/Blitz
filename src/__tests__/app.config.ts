import blitz from "../server";

const app = blitz();

app.request("GET::/hello", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

app.request("GET::/static/hello", (req, res) => {
  return res.view(
    "D:\\code\\customs\\blitz\\src\\__tests__\\static\\index.html"
  );
});

app.listen(3000);

export const testServer = app.getTestingServer();

import blitz from "../server";

const app = blitz();

app.request("GET::/app", (req, res) => {
  return res.json({
    hello: "World!",
  });
});

export const testServer = app.listen(3000);

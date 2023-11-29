import { testServer } from "./app.config";
import request from "supertest";

describe("Middleware should be registered well", () => {
  it("Should append headers correctly", (done) => {
    request(testServer)
      .get("/hello")
      .expect("Web-Server", /blitz/)
      .expect(200, done);
  });
});

import request from "supertest";
import { testServer } from "./app.config";

describe("POST Request should be handled correctly", () => {
  it("Should receive json requests correctly", (done) => {
    request(testServer)
      .post("/simple-post")
      .send({
        message: "Hello World!",
      })
      .set("Content-Type", "application/json")
      .expect({
        message: "Hello World!",
      })
      .expect(200, done);
  });
});

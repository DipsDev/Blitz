import { testServer } from "./app.config";
import request from "supertest";

describe("Middleware should be registered well", () => {
  it("Should return json", (done) => {
    request(testServer)
      .get("/hello")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

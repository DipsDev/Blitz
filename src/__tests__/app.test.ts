import request from "supertest";
import { testServer } from "./app.config";

describe("Simple http requests", () => {
  it("Should return json", (done) => {
    request(testServer)
      .get("/app")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

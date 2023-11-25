import request from "supertest";
import { testServer } from "./app.config";

describe("Simple http requests", () => {
  it("Should return json", (done) => {
    request(testServer)
      .get("/hello")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("Should work with ending /", (done) => {
    request(testServer).get("/hello/").expect(200, done);
  });

  it("Should display html file", (done) => {
    request(testServer).get("/static/hello").expect(200, done);
  });
});

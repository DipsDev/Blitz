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
  it("Should handle empty post data", (done) => {
    request(testServer)
      .post("/simple-post")
      .send({})
      .set("Content-Type", "application/json")
      .expect({})
      .expect(200, done);
  });
  it("Should respond correctly to not found pages", (done) => {
    request(testServer)
      .post("/not-found")
      .send({
        message: "Come on, work!",
      })
      .set("Content-Type", "application/json")
      .expect(404, done);
  });
  it("Should work with placeholder routes", (done) => {
    request(testServer)
      .post("/aba/ima")
      .send({
        shuffix: "ty",
      })
      .set("Content-Type", "application/json")
      .expect({
        a: "abaty",
        b: "imaty",
      })
      .expect(200, done);
  });
  it("Should throw an error 505", (done) => {
    request(testServer)
      .post("/convert-to-number")
      .send({
        a: 15, // intentional typo! ===> should be an int
        b: 0,
      })
      .expect(500, done);
  });
});

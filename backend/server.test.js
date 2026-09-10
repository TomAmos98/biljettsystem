import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./server.js";

describe("Biljettsystem API", () => {
  it("ska kunna hämta alla biljetter", async () => {
    const response = await request(app).get("/api/tickets");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("ska kunna skapa en ny biljett", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .send({});

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("code");
    expect(response.body.used).toBe(0);
  });
  it("ska ge 400 om biljettkod saknas", async () => {
  const response = await request(app)
    .post("/api/tickets/use")
    .send({ code: "" });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Biljettkod saknas");
});
});
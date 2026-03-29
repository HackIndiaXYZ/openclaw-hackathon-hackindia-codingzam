const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");

const makeToken = () => jwt.sign({ userId: "test-user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Explainable recommendation API", () => {
  test("returns 401 without token", async () => {
    const response = await request(app).post("/api/recommendations").send({});
    expect(response.status).toBe(401);
  });

  test("returns explainable opportunities with reasons and actions", async () => {
    const response = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${makeToken()}`)
      .send({
        track: "Internship",
        selectedOption: "Product Internship",
        timeline: "Immediate",
        profile: {
          year: "3rd Year",
          interests: "web development, product",
          skills: "react, communication",
        },
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.recommendations)).toBe(true);
    expect(Array.isArray(response.body.opportunities)).toBe(true);
    expect(response.body.opportunities.length).toBeGreaterThan(0);

    const first = response.body.opportunities[0];
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("confidence");
    expect(first).toHaveProperty("reasons");
    expect(Array.isArray(first.reasons)).toBe(true);
    expect(first.reasons.length).toBeGreaterThan(0);
    expect(Array.isArray(first.nextActions)).toBe(true);
    expect(first.nextActions.length).toBeGreaterThan(1);
  });

  test("validates required fields", async () => {
    const response = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${makeToken()}`)
      .send({ track: "Internship" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/required/i);
  });
});

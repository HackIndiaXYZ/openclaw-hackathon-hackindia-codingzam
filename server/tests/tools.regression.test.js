const request = require("supertest");
const jwt = require("jsonwebtoken");
const { PDFDocument } = require("pdf-lib");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");

const makeToken = () => jwt.sign({ userId: "test-user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

const authHeader = () => `Bearer ${makeToken()}`;

const createPdfBuffer = async (text = "test") => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  page.drawText(text, { x: 40, y: 350 });
  const bytes = await pdf.save();
  return Buffer.from(bytes);
};

describe("Tools API regression", () => {
  test("rejects request without auth token", async () => {
    const response = await request(app)
      .post("/api/tools/email-generator")
      .send({ recipient: "HR", purpose: "Follow up", tone: "Professional" });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token/i);
  });

  test("email generator returns output with valid payload", async () => {
    const response = await request(app)
      .post("/api/tools/email-generator")
      .set("Authorization", authHeader())
      .send({ recipient: "HR", purpose: "Internship follow up", tone: "Professional" });

    expect(response.status).toBe(200);
    expect(typeof response.body.output).toBe("string");
    expect(response.body.output.length).toBeGreaterThan(20);
  });

  test("assignment helper validates missing topic", async () => {
    const response = await request(app)
      .post("/api/tools/assignment-helper")
      .set("Authorization", authHeader())
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/topic/i);
  });

  test("code generator returns generated output", async () => {
    const response = await request(app)
      .post("/api/tools/code-generator")
      .set("Authorization", authHeader())
      .send({ description: "Create a debounce function", language: "JavaScript" });

    expect(response.status).toBe(200);
    expect(response.body.output).toContain("JavaScript");
  });

  test("image generator gracefully handles missing OPENAI_API_KEY", async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const response = await request(app)
      .post("/api/tools/image-generator")
      .set("Authorization", authHeader())
      .send({ prompt: "sunset over mountains" });

    process.env.OPENAI_API_KEY = previousKey;

    expect(response.status).toBe(200);
    expect(response.body.output).toMatch(/OPENAI_API_KEY/i);
  });

  test("merge pdf returns a downloadable pdf", async () => {
    const firstPdf = await createPdfBuffer("one");
    const secondPdf = await createPdfBuffer("two");

    const response = await request(app)
      .post("/api/tools/pdf/merge")
      .set("Authorization", authHeader())
      .attach("files", firstPdf, "one.pdf")
      .attach("files", secondPdf, "two.pdf");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/pdf");
    expect(response.body.length).toBeGreaterThan(100);
  });

  test("split pdf returns 400 for out-of-range page", async () => {
    const pdf = await createPdfBuffer("single-page");

    const response = await request(app)
      .post("/api/tools/pdf/split")
      .set("Authorization", authHeader())
      .field("page", "9")
      .attach("file", pdf, "single.pdf");

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid page/i);
  });

  test("overlay pdf requires text", async () => {
    const pdf = await createPdfBuffer("overlay-test");

    const response = await request(app)
      .post("/api/tools/pdf/overlay")
      .set("Authorization", authHeader())
      .field("page", "1")
      .attach("file", pdf, "overlay.pdf");

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/text is required/i);
  });

  test("compress pdf returns a downloadable pdf", async () => {
    const pdf = await createPdfBuffer("compress-test");

    const response = await request(app)
      .post("/api/tools/pdf/compress")
      .set("Authorization", authHeader())
      .attach("file", pdf, "compress.pdf");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/pdf");
    expect(response.body.length).toBeGreaterThan(80);
  });
});

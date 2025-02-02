import request from 'supertest';
import app from '../../src/app.js';

describe("Health API Integration Tests", () => {
  it("Should return 200 for GET /health", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("App Works!!");
  });
  it("Should return 404 for non existing route", async () => {
    const res = await request(app).get("/api/v1/test");
    expect(res.statusCode).toEqual(404);
  });
});

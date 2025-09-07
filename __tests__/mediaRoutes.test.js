import request from "supertest";
import app from "../server.js";
import { pool } from "../utils/database.js";

describe("Media Routes", () => {
  let token;

  beforeAll(async () => {
    jest.setTimeout(30000); 

    //signup
     await request(app)
    .post("/auth/signup")
    .send({ email: "media@test.com", password: "password123" });

    // Sign in to get a valid token
    const response = await request(app)
      .post("/auth/signin")
      .send({ email: "media@test.com", password: "password123" });

    token = response.body.JWT;
    console.log(token);

  });

  afterAll(async () => {
    await pool.query(`DELETE FROM admin_users WHERE email = $1`, [
          "media@test.com",
        ]);
    await pool.end();
  });

  it("should upload a media file", async () => {
    const response = await request(app)
      .post("/media")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("dummy content"), "test.mp4")
      .field("title", "Test Video")
      .field("type", "video");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should get a signed URL for streaming", async () => {
    const mediaId = "d1f354fb-1d30-422f-a70a-faba30a93cad";
    const response = await request(app)
      .get(`/media/${mediaId}/stream-url`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("url");
  });

  it("should log a view with rate limiting", async () => {
    const mediaId = "d1f354fb-1d30-422f-a70a-faba30a93cad";
    const response = await request(app)
      .post(`/media/${mediaId}/view`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should retrieve analytics", async () => {
    const mediaId = "d1f354fb-1d30-422f-a70a-faba30a93cad"; 
    const response = await request(app)
      .get(`/media/${mediaId}/analytics`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total_views");
    expect(response.body).toHaveProperty("unique_ips");
    expect(response.body).toHaveProperty("views_per_day");
  });
});

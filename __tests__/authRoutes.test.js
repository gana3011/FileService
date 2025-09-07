import request from "supertest";
import app from "../server.js";
import { pool } from "../utils/database.js";

describe("Auth Routes", () => {
  
  afterAll(async () => {
      await pool.query(`DELETE FROM admin_users WHERE email = $1`, [
            "test@example.com",
          ]);
      await pool.end();
    });

  it("should sign up a new user", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sign up successful");
  });

  it("should not sign up with an existing email", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already in use");
  });

  it("should sign in a user", async () => {
    const response = await request(app)
      .post("/auth/signin")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("JWT");
    expect(typeof response.body.JWT).toBe("string");
  });

  it("should not sign in with invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/signin")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

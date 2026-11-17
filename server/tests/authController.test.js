jest.mock("../db/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ hash: jest.fn(), compare: jest.fn() }));
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
});

describe("authentication controller", () => {
  beforeEach(() => { jest.clearAllMocks(); process.env.JWT_SECRET = "test-secret"; });

  test("registration requires email and password", async () => {
    const res = response();
    await register({ body: { email: "a@example.com" } }, res);
    expect(res.statusCode).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("registration rejects an existing email", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = response();
    await register({ body: { email: "a@example.com", password: "secret" } }, res);
    expect(res.statusCode).toBe(409);
  });

  test("registration hashes password and creates account", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ id: 2 }] });
    bcrypt.hash.mockResolvedValue("hashed-password");
    const res = response();
    await register({ body: { email: "new@example.com", password: "secret" } }, res);
    expect(res.statusCode).toBe(201);
    expect(bcrypt.hash).toHaveBeenCalledWith("secret", 10);
    expect(pool.query.mock.calls[1][1][1]).toBe("hashed-password");
  });

  test("login rejects missing credentials", async () => {
    const res = response();
    await login({ body: {} }, res);
    expect(res.statusCode).toBe(400);
  });

  test("login returns a JWT for valid credentials", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3, email: "a@example.com", role: "admin", password_hash: "hash" }] });
    bcrypt.compare.mockResolvedValue(true);
    const res = response();
    await login({ body: { email: "a@example.com", password: "secret" } }, res);
    expect(res.statusCode).toBe(200);
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).id).toBe(3);
  });

  test("login rejects an incorrect password", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3, password_hash: "hash" }] });
    bcrypt.compare.mockResolvedValue(false);
    const res = response();
    await login({ body: { email: "a@example.com", password: "wrong" } }, res);
    expect(res.statusCode).toBe(401);
  });
});

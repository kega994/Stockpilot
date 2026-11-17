const jwt = require("jsonwebtoken");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware");

describe("authentication middleware", () => {
  beforeAll(() => { process.env.JWT_SECRET = "test-secret"; });

  const response = () => ({
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  });

  test("rejects requests without a bearer token", () => {
    const res = response();
    const next = jest.fn();
    authenticateToken({ headers: {} }, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Access token required");
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects an invalid token", () => {
    const res = response();
    const next = jest.fn();
    authenticateToken({ headers: { authorization: "Bearer not-a-token" } }, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or expired token");
    expect(next).not.toHaveBeenCalled();
  });

  test("accepts a valid token and attaches its payload", () => {
    const payload = { id: 7, email: "admin@example.com", role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    authenticateToken(req, response(), next);
    expect(req.user.id).toBe(7);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("allows admins and blocks non-admin users", () => {
    const next = jest.fn();
    authorizeAdmin({ user: { role: "admin" } }, response(), next);
    expect(next).toHaveBeenCalledTimes(1);

    const res = response();
    authorizeAdmin({ user: { role: "customer" } }, res, jest.fn());
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Admin access required");
  });
});

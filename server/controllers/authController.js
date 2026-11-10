const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const client = await pool.connect();

    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email) || email.length > 254) {
            return res.status(400).json({
                error: "Please provide a valid email address"
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 8 ||
            password.length > 72
        ) {
            return res.status(400).json({
                error: "Password must be between 8 and 72 characters"
            });
        }

        await client.query("BEGIN");

        const hashedPassword = await bcrypt.hash(password, 12);

        // Create customer account
        const userResult = await client.query(
            `INSERT INTO users (email, password_hash, role)
             VALUES ($1, $2, $3)
             RETURNING id, email, role`,
            [email, hashedPassword, "customer"]
        );

        const user = userResult.rows[0];

        // Automatically create their empty basket
        await client.query(
            "INSERT INTO carts (user_id) VALUES ($1)",
            [user.id]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Account and basket created successfully",
            user
        });

    } catch (error) {
        await client.query("ROLLBACK");

        if (error.code === "23505") {
            return res.status(409).json({
                error: "An account with this email already exists"
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            error: "Unable to create account right now"
        });

    } finally {
        client.release();
    }
};


const login = async (req, res) => {
    // Implement login logic here
    try {
        const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    // Implement token generation logic here
    const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);
    res.status(200).json({ message: "Login successful", token });
} catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
}
};






    module.exports = { register,
  login
};
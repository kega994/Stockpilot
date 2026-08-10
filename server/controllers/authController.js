const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    // Implement registration logic here

    try{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const existinguser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
);

if (existinguser.rows.length > 0) {
    return res.status(409).json({
        error: "Email already exists"
    });
}


const hashedPassword = await bcrypt.hash(password, 10);

const result = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
    [email, hashedPassword]
);
res.status(201).json(
  { message: "User registered successfully" }
);


} catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
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
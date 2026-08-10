const pool = require("../db/db");


//get all categories
const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY name");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
};

module.exports = {
    getAllCategories,
};
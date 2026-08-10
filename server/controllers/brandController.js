const pool = require("../db/db");

const getAllBrands = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM brands ORDER BY name"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  getAllBrands,
};
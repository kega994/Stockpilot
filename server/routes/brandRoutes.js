const express = require("express");
const router = express.Router();

const { getAllBrands } = require("../controllers/brandController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getAllBrands);

module.exports = router;
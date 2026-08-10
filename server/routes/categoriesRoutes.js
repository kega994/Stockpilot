const express = require("express");
const router = express.Router();

const { getAllCategories } = require("../controllers/categorieController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getAllCategories);

module.exports = router;
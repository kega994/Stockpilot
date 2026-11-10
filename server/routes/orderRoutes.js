const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrderById
} = require("../controllers/orderController");

const {
  authenticateToken
} = require("../middleware/authMiddleware");

// Require login for all order routes
router.use(authenticateToken);

router.post("/", createOrder);

router.get("/:id", getOrderById);

module.exports = router;
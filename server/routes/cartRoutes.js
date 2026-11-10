const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    mergeCart
} = require("../controllers/cartController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

// Require authentication for all basket routes
router.use(authenticateToken);

// Get customer basket
router.get("/", getCart);

// Add product to basket
router.post("/add", addToCart);

// Merge guest basket into customer basket
router.post("/merge", mergeCart);

// Update product quantity
router.put("/update/:productId", updateCartItem);

// Remove product from basket
router.delete("/remove/:productId", removeFromCart);

module.exports = router;
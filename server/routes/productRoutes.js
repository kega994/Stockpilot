const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin} = require("../middleware/authMiddleware");

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products
router.post("/", authenticateToken, authorizeAdmin,  createProduct);

// PUT /api/products/:id
router.put("/:id", authenticateToken, authorizeAdmin, updateProduct);

// DELETE /api/products/:id
router.delete("/:id", authenticateToken, authorizeAdmin, deleteProduct);


module.exports = router;
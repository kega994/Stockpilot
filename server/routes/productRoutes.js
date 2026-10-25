const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin} = require("../middleware/authMiddleware");
const multer = require("multer");

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


const upload = multer({
  storage: multer.memoryStorage()
});

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  createProduct
);

// PUT /api/products/:id
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  upload.single("image"),
  updateProduct
);

// DELETE /api/products/:id
router.delete("/:id", authenticateToken, authorizeAdmin, deleteProduct);


module.exports = router;
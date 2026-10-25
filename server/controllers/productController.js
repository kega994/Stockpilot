const pool = require("../db/db");

// Convert PostgreSQL BYTEA into a browser-ready data URL
const formatImage = (image, mimeType) => {
  if (!image || !mimeType) {
    return null;
  }

  const base64Image = Buffer.from(image).toString("base64");

  return `data:${mimeType};base64,${base64Image}`;
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        products.id,
        products.name,
        products.description,
        products.sku,
        products.price,
        products.quantity,
        products.image,
        products.image_mime_type,
        brands.name AS brand,
        categories.name AS category
      FROM products
      JOIN brands ON products.brand_id = brands.id
      JOIN categories ON products.category_id = categories.id
      ORDER BY products.id
    `);

    const products = result.rows.map((product) => {
      const { image, image_mime_type, ...productData } = product;

      return {
        ...productData,
        image: formatImage(image, image_mime_type),
      };
    });

    res.json(products);
  } catch (err) {
    console.error(" Error fetching products:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        products.id,
        products.name,
        products.description,
        products.sku,
        products.price,
        products.quantity,
        products.brand_id,
        products.category_id,
        products.image,
        products.image_mime_type,
        brands.name AS brand,
        categories.name AS category
      FROM products
      JOIN brands ON products.brand_id = brands.id
      JOIN categories ON products.category_id = categories.id
      WHERE products.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = result.rows[0];

    const { image, image_mime_type, ...productData } = product;

    res.json({
      ...productData,
      image: formatImage(image, image_mime_type),
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// Create a product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      price,
      quantity,
      brand_id,
      category_id,
    } = req.body;

    const image = req.file;

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    // Validate required fields
    if (
      !name ||
      !sku ||
      !price ||
      quantity === undefined ||
      !brand_id ||
      !category_id ||
      !image
    ) {
      return res.status(400).json({
        error:
          "Name, SKU, price, quantity, brand, category and image are required",
      });
    }

    // Check if SKU already exists
    const existingProduct = await pool.query(
      `
      SELECT id
      FROM products
      WHERE sku = $1
      `,
      [sku]
    );

    if (existingProduct.rows.length > 0) {
      return res.status(409).json({
        error: "A product with this SKU already exists",
        productId: existingProduct.rows[0].id,
      });
    }

    // Create product
    const result = await pool.query(
      `
      INSERT INTO products
      (
        name,
        description,
        sku,
        price,
        quantity,
        brand_id,
        category_id,
        image,
        image_mime_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        name,
        description,
        sku,
        price,
        quantity,
        brand_id,
        category_id,
        image,
        image_mime_type
      `,
      [
        name,
        description,
        sku,
        price,
        quantity,
        brand_id,
        category_id,
        image.buffer,
        image.mimetype,
      ]
    );

    const product = result.rows[0];

    const {
      image: savedImage,
      image_mime_type: savedMimeType,
      ...productData
    } = product;

    res.status(201).json({
      message: "Product created successfully",
      product: {
        ...productData,
        image: formatImage(savedImage, savedMimeType),
      },
    });
  } catch (err) {
    console.error("❌ Error creating product:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      sku,
      price,
      quantity,
      brand_id,
      category_id,
    } = req.body;

    const image = req.file;

    // Validate required fields
    if (
      !name ||
      !sku ||
      !price ||
      quantity === undefined ||
      !brand_id ||
      !category_id
    ) {
      return res.status(400).json({
        error:
          "Name, SKU, price, quantity, brand and category are required",
      });
    }

    // Check if another product already uses this SKU
    const existingProduct = await pool.query(
      `
      SELECT id
      FROM products
      WHERE sku = $1
        AND id != $2
      `,
      [sku, id]
    );

    if (existingProduct.rows.length > 0) {
      return res.status(409).json({
        error: "Another product already uses this SKU",
        productId: existingProduct.rows[0].id,
      });
    }

    let result;

    if (image) {
      // Update product INCLUDING new image
      result = await pool.query(
        `
        UPDATE products
        SET
          name = $1,
          description = $2,
          sku = $3,
          price = $4,
          quantity = $5,
          brand_id = $6,
          category_id = $7,
          image = $8,
          image_mime_type = $9
        WHERE id = $10
        RETURNING
          id,
          name,
          description,
          sku,
          price,
          quantity,
          brand_id,
          category_id,
          image,
          image_mime_type
        `,
        [
          name,
          description,
          sku,
          price,
          quantity,
          brand_id,
          category_id,
          image.buffer,
          image.mimetype,
          id,
        ]
      );
    } else {
      // Update product WITHOUT changing existing image
      result = await pool.query(
        `
        UPDATE products
        SET
          name = $1,
          description = $2,
          sku = $3,
          price = $4,
          quantity = $5,
          brand_id = $6,
          category_id = $7
        WHERE id = $8
        RETURNING
          id,
          name,
          description,
          sku,
          price,
          quantity,
          brand_id,
          category_id,
          image,
          image_mime_type
        `,
        [
          name,
          description,
          sku,
          price,
          quantity,
          brand_id,
          category_id,
          id,
        ]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = result.rows[0];

    const {
      image: savedImage,
      image_mime_type: savedMimeType,
      ...productData
    } = product;

    res.json({
      message: "Product updated successfully",
      product: {
        ...productData,
        image: formatImage(savedImage, savedMimeType),
      },
    });
  } catch (err) {
    console.error("❌ Error updating product:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting product:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
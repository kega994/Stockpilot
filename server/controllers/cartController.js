const pool = require("../db/db");

// Convert database image into a browser-ready data URL
const formatImage = (image, mimeType) => {
  if (!image || !mimeType) return null;

  return `data:${mimeType};base64,${Buffer.from(image).toString("base64")}`;
};

// Shared query for retrieving a customer's basket
const getCartItems = async (userId, db = pool) => {
  const result = await db.query(
    `SELECT
        products.id,
        products.name,
        products.price,
        products.quantity,
        products.image,
        products.image_mime_type,
        brands.name AS brand,
        categories.name AS category,
        cart_items.quantity AS "basketQuantity"
     FROM carts
     JOIN cart_items ON carts.id = cart_items.cart_id
     JOIN products ON products.id = cart_items.product_id
     JOIN brands ON products.brand_id = brands.id
     JOIN categories ON products.category_id = categories.id
     WHERE carts.user_id = $1
     ORDER BY cart_items.id`,
    [userId]
  );

  return result.rows.map((item) => {
    const { image, image_mime_type, ...product } = item;

    return {
      ...product,
      image: formatImage(image, image_mime_type)
    };
  });
};


// GET: Fetch customer's basket
const getCart = async (req, res) => {
  try {
    const cart = await getCartItems(req.user.id);

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      error: "Unable to fetch basket"
    });
  }
};


// POST: Add product to basket
const addToCart = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity ?? 1);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        error: "Valid product ID and quantity are required"
      });
    }

    await client.query("BEGIN");

    // Lock the product while checking stock
    const productResult = await client.query(
      `SELECT quantity
       FROM products
       WHERE id = $1
       FOR UPDATE`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Product not found"
      });
    }

    const stock = Number(productResult.rows[0].quantity);

    const existingResult = await client.query(
      `SELECT cart_items.quantity
       FROM cart_items
       JOIN carts ON carts.id = cart_items.cart_id
       WHERE carts.user_id = $1
       AND cart_items.product_id = $2`,
      [userId, productId]
    );

    const existingQuantity = existingResult.rows.length
      ? Number(existingResult.rows[0].quantity)
      : 0;

    if (existingQuantity + quantity > stock) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error: `Not enough stock. Available stock: ${stock}`
      });
    }

    const result = await client.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       SELECT carts.id, $2, $3
       FROM carts
       WHERE carts.user_id = $1
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity =
         cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [userId, productId, quantity]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Customer basket not found"
      });
    }

    await client.query("COMMIT");

    const cart = await getCartItems(userId);

    return res.status(200).json({
      message: "Product added to basket",
      cart
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Add to cart error:", error);

    return res.status(500).json({
      error: "Unable to add product to basket"
    });
  } finally {
    client.release();
  }
};


// PUT: Update basket quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        error: "Valid product ID and quantity are required"
      });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       FROM carts, products
       WHERE cart_items.cart_id = carts.id
       AND cart_items.product_id = products.id
       AND carts.user_id = $2
       AND cart_items.product_id = $3
       AND products.quantity >= $1
       RETURNING cart_items.*`,
      [quantity, userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Basket item not found or requested quantity exceeds stock"
      });
    }

    const cart = await getCartItems(userId);

    return res.status(200).json({
      message: "Basket updated",
      cart
    });

  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      error: "Unable to update basket"
    });
  }
};


// DELETE: Remove product from basket
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        error: "Valid product ID is required"
      });
    }

    const result = await pool.query(
      `DELETE FROM cart_items
       USING carts
       WHERE cart_items.cart_id = carts.id
       AND carts.user_id = $1
       AND cart_items.product_id = $2
       RETURNING cart_items.*`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Basket item not found"
      });
    }

    const cart = await getCartItems(userId);

    return res.status(200).json({
      message: "Product removed from basket",
      cart
    });

  } catch (error) {
    console.error("Remove from cart error:", error);

    return res.status(500).json({
      error: "Unable to remove product"
    });
  }
};


// POST: Merge guest basket into customer's database basket
const mergeCart = async (req, res) => {

  console.log("MERGE CART REQUEST RECEIVED");
  console.log("Customer ID:", req.user.id);
  console.log("Basket items received:", req.body.items);

  
  const client = await pool.connect();
  let transactionStarted = false;

  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: "Valid basket items are required"
      });
    }

    await client.query("BEGIN");
    transactionStarted = true;

    // Lock the customer's basket
    const cartResult = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1
       FOR UPDATE`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      throw new Error("Customer basket not found");
    }

    for (const item of items) {
      const productId = Number(item.id);
      const quantity = Number(item.basketQuantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error("Invalid basket item");
      }

      // Lock product and check stock
      const productResult = await client.query(
        `SELECT quantity
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product ${productId} was not found`);
      }

      const stock = Number(productResult.rows[0].quantity);

      const existingResult = await client.query(
        `SELECT quantity
         FROM cart_items
         WHERE cart_id = $1
         AND product_id = $2`,
        [cartResult.rows[0].id, productId]
      );

      const existingQuantity = existingResult.rows.length
        ? Number(existingResult.rows[0].quantity)
        : 0;

      const totalQuantity = existingQuantity + quantity;

      if (totalQuantity > stock) {
        throw new Error(
          `Not enough stock for product ${productId}. Available stock: ${stock}`
        );
      }

      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (cart_id, product_id)
         DO UPDATE SET quantity = EXCLUDED.quantity`,
        [cartResult.rows[0].id, productId, totalQuantity]
      );
    }

    await client.query("COMMIT");
    transactionStarted = false;

    const cart = await getCartItems(userId);

    return res.status(200).json({
      message: "Guest basket merged successfully",
      cart
    });

  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    console.error("Merge basket error:", error);

    return res.status(400).json({
      error: error.message || "Unable to merge basket"
    });
  } finally {
    client.release();
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  mergeCart
};
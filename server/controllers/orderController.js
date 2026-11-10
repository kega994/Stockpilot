const pool = require("../db/db");

// Create an order from the logged-in customer's database basket
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    const {
      customer_name,
      email,
      address_line1,
      address_line2,
      city,
      postcode,
      delivery_method
    } = req.body;

    // Validate customer details
    if (
      !customer_name ||
      !email ||
      !address_line1 ||
      !city ||
      !postcode
    ) {
      return res.status(400).json({
        error: "Please complete all required customer details."
      });
    }

    await client.query("BEGIN");

    // Find and lock the customer's basket
    const cartResult = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1
       FOR UPDATE`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Customer basket not found."
      });
    }

    const cartId = cartResult.rows[0].id;

    // Retrieve basket items and current product prices
    const basketResult = await client.query(
      `SELECT
          products.id,
          products.name,
          products.price,
          products.quantity AS stock,
          cart_items.quantity AS basket_quantity
       FROM cart_items
       JOIN products
          ON products.id = cart_items.product_id
       WHERE cart_items.cart_id = $1
       ORDER BY products.id
       FOR UPDATE OF products`,
      [cartId]
    );

    if (basketResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error: "Your basket is empty."
      });
    }

    let subtotal = 0;
    const orderItems = [];

    // Check stock and calculate order totals
    for (const item of basketResult.rows) {
      const quantity = Number(item.basket_quantity);
      const stock = Number(item.stock);

      if (quantity > stock) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          error: `${item.name} does not have enough stock.`,
          productId: item.id,
          availableStock: stock
        });
      }

      const price = Number(item.price);
      const itemTotal = price * quantity;

      subtotal += itemTotal;

      orderItems.push({
        product_id: item.id,
        product_name: item.name,
        price,
        quantity
      });
    }

    const delivery = subtotal > 0 ? 4.99 : 0;
    const total = subtotal + delivery;

    const orderNumber =
      `SP-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    // Create the order and link it to the customer account
    const orderResult = await client.query(
      `INSERT INTO orders (
          user_id,
          order_number,
          customer_name,
          email,
          address_line1,
          address_line2,
          city,
          postcode,
          delivery_method,
          subtotal,
          delivery,
          total
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        userId,
        orderNumber,
        customer_name,
        email,
        address_line1,
        address_line2 || null,
        city,
        postcode,
        delivery_method || "Standard Delivery",
        subtotal,
        delivery,
        total
      ]
    );

    const order = orderResult.rows[0];

    // Save order items and reduce product stock
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            price,
            quantity
         )
         VALUES ($1,$2,$3,$4,$5)`,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.price,
          item.quantity
        ]
      );

      await client.query(
        `UPDATE products
         SET quantity = quantity - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Clear the customer's basket
    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = $1`,
      [cartId]
    );

    // Commit the transaction
    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order placed successfully",
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Error creating order:", err);

    return res.status(500).json({
      error: "Internal server error"
    });

  } finally {
    client.release();
  }
};


// Retrieve an order belonging to the logged-in customer
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1
       AND user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found."
      });
    }

    const order = orderResult.rows[0];

    // Retrieve the order's items
    const itemsResult = await pool.query(
      `SELECT
          product_id,
          product_name,
          price,
          quantity
       FROM order_items
       WHERE order_id = $1`,
      [order.id]
    );

    return res.status(200).json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });

  } catch (err) {
    console.error("Error retrieving order:", err);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

module.exports = {
  createOrder,
  getOrderById
};
const pool = require("../db/db");

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      customer_name,
      email,
      address_line1,
      address_line2,
      city,
      postcode,
      delivery_method,
      items
    } = req.body;

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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Your basket is empty."
      });
    }

    await client.query("BEGIN");

    let subtotal = 0;

    const orderItems = [];

    for (const item of items) {
      if (
        !item.product_id ||
        !item.quantity ||
        item.quantity < 1
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          error: "Invalid basket item."
        });
      }

      const productResult = await client.query(
        `
        SELECT
          id,
          name,
          price,
          quantity
        FROM products
        WHERE id = $1
        FOR UPDATE
        `,
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          error: "One of the products no longer exists."
        });
      }

      const product = productResult.rows[0];

      if (product.quantity < item.quantity) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          error: `${product.name} does not have enough stock.`,
          productId: product.id,
          availableStock: product.quantity
        });
      }

      const itemPrice = Number(product.price);

      const itemTotal =
        itemPrice * Number(item.quantity);

      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        price: itemPrice,
        quantity: Number(item.quantity)
      });
    }

    const delivery = subtotal > 0 ? 4.99 : 0;

    const total = subtotal + delivery;

    const orderNumber =
      `SP-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
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
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )
      RETURNING
        id,
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
        total,
        status,
        created_at
      `,
      [
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

    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          price,
          quantity
        )
        VALUES
        ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.price,
          item.quantity
        ]
      );

      await client.query(
        `
        UPDATE products
        SET quantity = quantity - $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.product_id
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully",

      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error(
      "❌ Error creating order:",
      err
    );

    res.status(500).json({
      error: "Internal server error"
    });

  } finally {
    client.release();
  }
};


const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `
      SELECT
        id,
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
        total,
        status,
        created_at
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found."
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        product_name,
        price,
        quantity
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });

  } catch (err) {
    console.error(
      "❌ Error fetching order:",
      err
    );

    res.status(500).json({
      error: "Internal server error"
    });
  }
};

module.exports = {
  createOrder,
  getOrderById
};
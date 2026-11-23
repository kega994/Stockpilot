const createOrder = async (orderData) => {
  try {
    const response = await fetch(
      "https://stockpilot-api-tn3t.onrender.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to place order"
      );
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const response = await fetch(
      `https://stockpilot-api-tn3t.onrender.com/api/orders/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to fetch order"
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export {
  createOrder,
  getOrderById
};
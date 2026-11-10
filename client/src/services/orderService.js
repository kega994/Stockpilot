const API_URL = "http://localhost:3000/api";

const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to place order");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch order");
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
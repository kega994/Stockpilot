const getBrands = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://stockpilot-api-tn3t.onrender.com/api/brands", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export { getBrands };
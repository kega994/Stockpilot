const getBrands = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/brands", {
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
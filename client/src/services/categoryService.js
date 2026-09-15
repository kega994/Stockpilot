const getCategories = async () =>{
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/categories", {
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export { getCategories };
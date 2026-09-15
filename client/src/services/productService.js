
//Get all products
const getProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/products", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

//Delete product
const deleteProduct = async (id) => {
  

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };


  //Create product
  const createProduct = async (product) =>{
        try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      const data = await response.json();

      // Product already exists or another backend error
      if (!response.ok) {
        throw new Error(data.error )
      }

    return data;

    } catch (error) {
      throw error;
    }
  };


  const getProductById = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

//update product
const updateProduct = async (id, product) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update product");
    }

    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export { getProducts, deleteProduct, createProduct, getProductById, updateProduct };











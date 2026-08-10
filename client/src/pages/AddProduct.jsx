import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // Dropdown data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Error message
  const [error, setError] = useState("");

  // Fetch brands and categories
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/brands",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

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
          body: JSON.stringify({
            name,
            description,
            sku,
            price,
            quantity,
            brand_id: brand,
            category_id: category,
          }),
        }
      );

      const data = await response.json();

      // Product already exists or another backend error
      if (!response.ok) {
        setError(data.error || "Failed to create product");
        return;
      }

      // Successful creation
      console.log("Product created:", data);

      // Reset form
      setName("");
      setDescription("");
      setSku("");
      setPrice("");
      setQuantity("");
      setBrand("");
      setCategory("");

      // Go back to products
      navigate("/products");

    } catch (error) {
      console.error("Error creating product:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Add Product</h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        {/* Product name */}
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* SKU */}
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        {/* Price */}
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Quantity */}
        <input
          type="number"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Brand */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">
            Select a brand
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">
            Select a category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button type="submit">
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
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
        setProducts(data);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
    <button onClick={() => navigate("/products/add")}>Add Product</button>
  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Name</th>
        <th>Brand</th>
        <th>Category</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.sku}</td>
          <td>{product.name}</td>
          <td>{product.brand}</td>
          <td>{product.category}</td>
          <td>${product.price}</td>
          <td>{product.quantity}</td>
          <td>
            <button onClick={() => navigate(`/products/edit/${product.id}`)}>
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </>
);
}

export default Products;
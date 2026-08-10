import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Get existing product + brands + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get product
        const productResponse = await fetch(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }

        const product = await productResponse.json();

        setName(product.name);
        setDescription(product.description || "");
        setSku(product.sku);
        setPrice(product.price);
        setQuantity(product.quantity);
        setBrand(product.brand_id);
        setCategory(product.category_id);

        // Get brands
        const brandsResponse = await fetch(
          "http://localhost:3000/api/brands",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!brandsResponse.ok) {
          throw new Error("Failed to fetch brands");
        }

        const brandsData = await brandsResponse.json();
        setBrands(brandsData);

        // Get categories
        const categoriesResponse = await fetch(
          "http://localhost:3000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

      } catch (error) {
        console.error("Error loading product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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

      if (!response.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      console.log("Product updated:", data);

      navigate("/products");

    } catch (error) {
      console.error("Error updating product:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Edit Product</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Select a brand</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate("/products")}
        >
          Cancel
        </button>

      </form>
    </>
  );
}

export default EditProduct;
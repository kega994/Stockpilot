import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import {
  getProductById,
  updateProduct
} from "../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // Image state
  const [image, setImage] = useState(null);
  const [productImage, setProductImage] = useState(null);

  // Dropdown data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load product, brands and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await getProductById(id);

        setName(product.name);
        setDescription(product.description || "");
        setSku(product.sku);
        setPrice(product.price);
        setQuantity(product.quantity);
        setBrand(product.brand_id);
        setCategory(product.category_id);

        // Existing image
        setProductImage(product.image);

        // Get brands
        const brandsData = await getBrands();
        setBrands(brandsData);

        // Get categories
        const categoriesData = await getCategories();
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

    // Validate required fields
    if (
      !name ||
      !sku ||
      !price ||
      !quantity ||
      !brand ||
      !category
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Create FormData
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("brand_id", brand);
    formData.append("category_id", category);

    // Only send a new image if the user selected one
    if (image) {
      formData.append("image", image);
    }

    try {
      const data = await updateProduct(id, formData);

      console.log("Product updated:", data);

      // Return to products page
      navigate("/products");

    } catch (error) {
      console.error("Error updating product:", error);

      setError(
        error.message || "Something went wrong. Please try again."
      );
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

        {/* Current image */}
        {productImage && (
          <div>
            <p>Current Image:</p>

            <img
              src={productImage}
              alt={name}
              width="200"
            />
          </div>
        )}

        {/* Change image */}
        <label>
          Change Product Image

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* Save */}
        <button type="submit">
          Save Changes
        </button>

        {/* Cancel */}
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
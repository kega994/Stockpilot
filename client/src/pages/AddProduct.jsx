import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import "../styles/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !name ||
      !sku ||
      !price ||
      !quantity ||
      !brand ||
      !category ||
      !image
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("brand_id", brand);
    formData.append("category_id", category);
    formData.append("image", image);

    try {
      await createProduct(formData);

      setName("");
      setDescription("");
      setSku("");
      setPrice("");
      setQuantity("");
      setBrand("");
      setCategory("");
      setImage(null);

      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">

        <div className="add-product-header">
          <div>
            <p className="add-product-label">INVENTORY MANAGEMENT</p>

            <h1>Add Product</h1>

            <p>
              Add a new product to your StockPilot inventory.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </button>
        </div>

        <div className="add-product-card">

          {error && (
            <div className="add-product-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-section">
              <h2>Product Information</h2>

              <p>
                Enter the basic details for your product.
              </p>

              <div className="form-grid">

                <div className="form-group form-group-full">
                  <label>Product Name *</label>

                  <input
                    type="text"
                    placeholder="e.g. MacBook Air M3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Description</label>

                  <textarea
                    placeholder="Enter a description of the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>SKU *</label>

                  <input
                    type="text"
                    placeholder="e.g. MAC-M3-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Price *</label>

                  <div className="input-with-prefix">
                    <span>$</span>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Brand *</label>

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
                </div>

                <div className="form-group">
                  <label>Category *</label>

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
                </div>

              </div>
            </div>

            <div className="form-section image-section">

              <h2>Product Image</h2>

              <p>
                Add a product image for the storefront.
              </p>

              <label className="image-upload">

                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  {image
                    ? image.name
                    : "Choose a product image"}
                </strong>

                <span>
                  {image
                    ? "Image selected successfully"
                    : "PNG, JPG or WEBP"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />

              </label>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
              >
                Add Product
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddProduct;
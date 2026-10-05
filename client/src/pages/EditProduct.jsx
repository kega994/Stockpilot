import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import {
  getProductById,
  updateProduct
} from "../services/productService";
import "../styles/EditProduct.css";

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
    return (
      <div className="edit-product-page">
        <div className="edit-product-loading">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">

      <main className="edit-product-container">

        {/* Page header */}

        <div className="edit-product-header">

          <div>
            <p className="edit-product-label">
              INVENTORY MANAGEMENT
            </p>

            <h1>Edit Product</h1>

            <p>
              Update the product information and inventory details.
            </p>
          </div>

          <button
            type="button"
            className="back-products-button"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="edit-product-error">
            {error}
          </div>
        )}

        {/* Form */}

        <form
          className="edit-product-form"
          onSubmit={handleSubmit}
        >

          {/* Product information */}

          <section className="edit-form-section">

            <div className="edit-section-header">
              <h2>Product Information</h2>

              <p>
                Basic information about the product.
              </p>
            </div>

            <div className="edit-form-grid">

              {/* Product name */}

              <div className="edit-form-group edit-full-width">

                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              {/* Description */}

              <div className="edit-form-group edit-full-width">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  placeholder="Describe the product..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

              </div>

              {/* SKU */}

              <div className="edit-form-group">

                <label htmlFor="sku">
                  SKU
                </label>

                <input
                  id="sku"
                  type="text"
                  placeholder="SKU"
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value)
                  }
                />

              </div>

              {/* Price */}

              <div className="edit-form-group">

                <label htmlFor="price">
                  Price
                </label>

                <div className="price-input">

                  <span>$</span>

                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* Quantity */}

              <div className="edit-form-group">

                <label htmlFor="quantity">
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                />

              </div>

              {/* Brand */}

              <div className="edit-form-group">

                <label htmlFor="brand">
                  Brand
                </label>

                <select
                  id="brand"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
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

              {/* Category */}

              <div className="edit-form-group">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
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

          </section>

          {/* Image section */}

          <section className="edit-form-section">

            <div className="edit-section-header">
              <h2>Product Image</h2>

              <p>
                View the current image or upload a replacement.
              </p>
            </div>

            <div className="edit-image-section">

              {/* Current image */}

              <div className="current-product-image">

                <p className="image-section-label">
                  Current Image
                </p>

                <div className="current-image-container">

                  {productImage ? (
                    <img
                      src={productImage}
                      alt={name}
                    />
                  ) : (
                    <span>
                      No image available
                    </span>
                  )}

                </div>

              </div>

              {/* New image */}

              <div className="new-product-image">

                <p className="image-section-label">
                  Change Image
                </p>

                <label
                  className="image-upload-box"
                  htmlFor="product-image"
                >

                  <span className="upload-icon">
                    ↑
                  </span>

                  <strong>
                    Choose a new image
                  </strong>

                  <span>
                    PNG, JPG or other image files
                  </span>

                  {image && (
                    <small>
                      Selected: {image.name}
                    </small>
                  )}

                </label>

                <input
                  id="product-image"
                  className="hidden-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                />

              </div>

            </div>

          </section>

          {/* Actions */}

          <div className="edit-product-actions">

            <button
              type="button"
              className="cancel-edit-button"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-button"
            >
              Save Changes
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditProduct;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductById } from "../services/productService";
import BasketContext from "../context/BasketContext";
import Header from "../components/Header";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const { addToBasket } = useContext(BasketContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Failed to load product.");
      }
    };

    loadProduct();
  }, [id]);

  if (error) {
    return (
      <div className="product-details-page">
        <Header />

        <div className="product-details-error">
          <h1>Product unavailable</h1>
          <p>{error}</p>

          <button onClick={() => navigate("/")}>
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Header />

        <div className="product-details-loading">
          Loading product details...
        </div>
      </div>
    );
  }

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="product-details-page">

      <Header />

      <main className="product-details-container">

        {/* Back button */}

        <button
          className="back-to-products"
          onClick={() => navigate("/")}
        >
          ← Back to Store
        </button>

        {/* Product */}

        <section className="product-details-card">

          {/* Image */}

          <div className="product-details-image">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="product-no-image">
                No image available
              </div>
            )}

          </div>

          {/* Information */}

          <div className="product-details-info">

            <p className="product-details-category">
              {product.category}
            </p>

            <h1>
              {product.name}
            </h1>

            <p className="product-details-brand">
              {product.brand}
            </p>

            <div className="product-details-price">
              ${Number(product.price).toFixed(2)}
            </div>

            <div className="product-details-divider"></div>

            <div className="product-details-description">

              <h2>
                Product Description
              </h2>

              <p>
                {product.description ||
                  "No description available for this product."}
              </p>

            </div>

            <div className="product-details-meta">

              <div>
                <span>SKU</span>
                <strong>{product.sku}</strong>
              </div>

              <div>
                <span>Availability</span>

                <strong
                  className={
                    isOutOfStock
                      ? "stock-out"
                      : product.quantity <= 5
                      ? "stock-low"
                      : "stock-good"
                  }
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : `${product.quantity} in stock`}
                </strong>
              </div>

            </div>

            <button
              className="product-details-basket-button"
              onClick={() => addToBasket(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock
                ? "Out of Stock"
                : "Add to Basket"}
            </button>

          </div>

        </section>

        {/* Benefits */}

        <section className="product-details-benefits">

          <div>
            <span className="benefit-icon">
              ✓
            </span>

            <div>
              <h3>Quality Products</h3>
              <p>
                Trusted technology and electronics.
              </p>
            </div>
          </div>

          <div>
            <span className="benefit-icon">
              ⚡
            </span>

            <div>
              <h3>Fast Delivery</h3>
              <p>
                Quick delivery on your order.
              </p>
            </div>
          </div>

          <div>
            <span className="benefit-icon">
              ↩
            </span>

            <div>
              <h3>Easy Returns</h3>
              <p>
                Simple and hassle-free returns.
              </p>
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;
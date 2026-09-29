import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import BasketContext from "../context/BasketContext";
import Header from "../components/Header";
import "../styles/Home.css";

function Home() {
  const { addToBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="home">

      <Header />

      {/* Category navigation */}

      <nav className="category-nav">
        <div className="category-nav-inner">
          <span>Computers</span>
          <span>Laptops</span>
          <span>Phones</span>
          <span>Gaming</span>
          <span>Audio</span>
          <span>TV & Monitors</span>
          <span>Accessories</span>
        </div>
      </nav>

      {/* Hero */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            STOCKPILOT ELECTRONICS
          </p>

          <h1>
            Technology that
            <span> works for you.</span>
          </h1>

          <p className="hero-description">
            Discover the latest computers, phones, gaming equipment,
            audio and electronics.
          </p>

        </div>

      </section>

      {/* Products */}

      <main className="products-section">

        <div className="products-header">

          <div>

            <p className="section-label">
              FEATURED PRODUCTS
            </p>

            <h2>
              Latest Technology
            </h2>

          </div>

        </div>

        <div className="product-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.id}
              onClick={() =>
                handleProductClick(product.id)
              }
            >

              {/* Product image */}

              <div className="product-image-container">


                {product.image ? (
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="no-image">
                    No image
                  </div>
                )}

              </div>

              {/* Product information */}

              <div className="product-info">

                <p className="product-category">
                  {product.category}
                </p>

                <h3>
                  {product.name}
                </h3>

                <p className="product-brand">
                  {product.brand}
                </p>

                <div className="product-bottom">

                  <div>

                    <p className="price-label">
                      Our price
                    </p>

                    <p className="product-price">
                      ${Number(product.price).toFixed(2)}
                    </p>

                  </div>

                  <button
                    className="add-to-basket"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBasket(product);
                    }}
                  >
                    Add to Basket
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

      {/* Benefits */}

      <section className="benefits">

        <div className="benefit">

          <div className="benefit-icon">
            ✓
          </div>

          <div>
            <h3>
              Quality Products
            </h3>

            <p>
              Reliable technology from trusted brands.
            </p>
          </div>

        </div>

        <div className="benefit">

          <div className="benefit-icon">
            ⚡
          </div>

          <div>
            <h3>
              Fast Delivery
            </h3>

            <p>
              Get your technology delivered quickly.
            </p>
          </div>

        </div>

        <div className="benefit">

          <div className="benefit-icon">
            ↩
          </div>

          <div>
            <h3>
              Easy Returns
            </h3>

            <p>
              Simple and hassle-free returns.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
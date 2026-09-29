import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import BasketContext from "../context/BasketContext";
import Header from "../components/Header";
import "../styles/Checkoutpage.css";

function Checkoutpage() {
  const {
    basket,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(BasketContext);

  const navigate = useNavigate();

  const subtotal = basket.reduce((total, item) => {
    return total + Number(item.price) * item.basketQuantity;
  }, 0);

  const delivery = subtotal > 0 ? 4.99 : 0;

  const total = subtotal + delivery;

  if (basket.length === 0) {
    return (
      <div className="checkout-page">
        <Header />

        <main className="empty-basket">
          <div className="empty-basket-icon">
            🛒
          </div>

          <p className="checkout-label">
            YOUR BASKET
          </p>

          <h1>Your basket is empty</h1>

          <p>
            You haven't added any products to your basket yet.
          </p>

          <button
            className="continue-shopping-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />

      <main className="checkout-container">

        {/* Page heading */}

        <div className="checkout-heading">
          <p className="checkout-label">
            YOUR BASKET
          </p>

          <h1>Shopping Basket</h1>

          <p>
            Review your products before continuing.
          </p>
        </div>

        <div className="checkout-layout">

          {/* Basket items */}

          <section className="basket-section">

            <div className="basket-section-header">
              <h2>
                Your Items
              </h2>

              <span>
                {basket.reduce(
                  (total, item) =>
                    total + item.basketQuantity,
                  0
                )}{" "}
                items
              </span>
            </div>

            <div className="basket-items">

              {basket.map((item) => {

                const itemTotal =
                  Number(item.price) *
                  item.basketQuantity;

                return (
                  <div
                    className="basket-item"
                    key={item.id}
                  >

                    {/* Product image */}

                    <div className="basket-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          No image
                        </span>
                      )}

                    </div>

                    {/* Product information */}

                    <div className="basket-product-info">

                      <p className="basket-category">
                        {item.category}
                      </p>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="basket-brand">
                        {item.brand}
                      </p>

                      <p className="basket-unit-price">
                        ${Number(item.price).toFixed(2)} each
                      </p>

                    </div>

                    {/* Quantity */}

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.basketQuantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* Total */}

                    <div className="basket-item-total">

                      <span>
                        Item total
                      </span>

                      <strong>
                        ${itemTotal.toFixed(2)}
                      </strong>

                    </div>

                  </div>
                );
              })}

            </div>

            <button
              className="continue-shopping"
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </button>

          </section>

          {/* Order summary */}

          <aside className="order-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">
              <span>
                Subtotal
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Delivery
              </span>

              <strong>
                ${delivery.toFixed(2)}
              </strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>
            </div>

            <button className="checkout-button">
              Proceed to Checkout
            </button>

            <div className="secure-checkout">
              <span>✓</span>

              <p>
                Secure checkout
              </p>
            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}

export default Checkoutpage;
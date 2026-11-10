import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasketContext from "../context/BasketContext";
import Header from "../components/Header";
import { createOrder } from "../services/orderService";
import "../styles/Checkout.css";

function Checkout() {
  const {
    basket,
    clearBasket,
    loadCustomerBasket
  } = useContext(BasketContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [basketLoading, setBasketLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Require login and load the customer's saved database basket
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
        state: {
          from: location.pathname
        }
      });

      return;
    }

    const loadBasket = async () => {
      try {
        await loadCustomerBasket();
      } catch (error) {
        console.error("Unable to load checkout basket:", error);
        setError(error.message || "Unable to load your basket.");

        // If the login token is invalid, return to login
        if (
          error.message?.includes("401") ||
          error.message?.includes("403") ||
          error.message?.toLowerCase().includes("token")
        ) {
          localStorage.removeItem("token");

          navigate("/login", {
            replace: true,
            state: {
              from: location.pathname
            }
          });
        }
      } finally {
        setBasketLoading(false);
      }
    };

    loadBasket();
  }, [navigate, location.pathname]);

  const subtotal = basket.reduce((total, item) => {
    return total + Number(item.price) * item.basketQuantity;
  }, 0);

  const delivery = subtotal > 0 ? 4.99 : 0;

  const total = subtotal + delivery;

  // Place the order using the customer's saved database basket
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (basket.length === 0) {
      setError("Your basket is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        customer_name: customerName,
        email,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        postcode,
        delivery_method: "Standard Delivery"
      };

      const data = await createOrder(orderData);

      // Clear/refresh the basket after a successful order
      await clearBasket();

      // Navigate to order confirmation
      navigate(
        `/order-confirmation/${data.order.id}`,
        {
          state: {
            order: data.order
          }
        }
      );
    } catch (error) {
      console.error("Error placing order:", error);

      setError(
        error.message ||
        "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Show loading while the saved basket is retrieved
  if (basketLoading) {
    return (
      <div className="checkout-page">
        <Header />

        <main className="checkout-empty">
          <p>Loading your basket...</p>
        </main>
      </div>
    );
  }

  // If basket is empty
  if (basket.length === 0) {
    return (
      <div className="checkout-page">
        <Header />

        <main className="checkout-empty">
          <div className="checkout-empty-icon">
            🛒
          </div>

          <p className="checkout-label">
            CHECKOUT
          </p>

          <h1>
            Your basket is empty
          </h1>

          <p>
            Add some products before continuing to checkout.
          </p>

          <button
            className="checkout-continue-button"
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

        {/* Header */}

        <div className="checkout-heading">

          <p className="checkout-label">
            CHECKOUT
          </p>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your details and delivery address below.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* Checkout form */}

          <form
            id="checkout-form"
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >

            {/* Contact information */}

            <section className="checkout-form-section">

              <div className="checkout-section-header">

                <h2>
                  Contact Information
                </h2>

                <p>
                  We'll use these details for your order.
                </p>

              </div>

              <div className="checkout-form-grid">

                <div className="checkout-form-group">

                  <label htmlFor="customerName">
                    Full Name
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    placeholder="Your full name"
                    required
                  />

                </div>

                <div className="checkout-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>

            </section>

            {/* Delivery address */}

            <section className="checkout-form-section">

              <div className="checkout-section-header">

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Where should we deliver your order?
                </p>

              </div>

              <div className="checkout-form-grid">

                <div className="checkout-form-group checkout-full-width">

                  <label htmlFor="addressLine1">
                    Address
                  </label>

                  <input
                    id="addressLine1"
                    type="text"
                    value={addressLine1}
                    onChange={(e) =>
                      setAddressLine1(e.target.value)
                    }
                    placeholder="Street address"
                    required
                  />

                </div>

                <div className="checkout-form-group checkout-full-width">

                  <label htmlFor="addressLine2">
                    Address Line 2
                    <span> (optional)</span>
                  </label>

                  <input
                    id="addressLine2"
                    type="text"
                    value={addressLine2}
                    onChange={(e) =>
                      setAddressLine2(e.target.value)
                    }
                    placeholder="Apartment, unit, etc."
                  />

                </div>

                <div className="checkout-form-group">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    placeholder="City"
                    required
                  />

                </div>

                <div className="checkout-form-group">

                  <label htmlFor="postcode">
                    Postcode
                  </label>

                  <input
                    id="postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) =>
                      setPostcode(e.target.value)
                    }
                    placeholder="Postcode"
                    required
                  />

                </div>

              </div>

            </section>

            {/* Navigation */}

            <button
              type="button"
              className="checkout-back-button"
              onClick={() => navigate("/checkout")}
            >
              ← Back to Basket
            </button>

          </form>

          {/* Order summary */}

          <aside className="checkout-order-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-summary-items">

              {basket.map((item) => (

                <div
                  className="checkout-summary-item"
                  key={item.id}
                >

                  <div className="checkout-summary-image">

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

                  <div className="checkout-summary-product">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.basketQuantity}
                    </span>

                  </div>

                  <strong className="checkout-summary-price">
                    $
                    {(
                      Number(item.price) *
                      item.basketQuantity
                    ).toFixed(2)}
                  </strong>

                </div>

              ))}

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>

            </div>

            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong>
                ${delivery.toFixed(2)}
              </strong>

            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-summary-total">

              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

            <button
              type="submit"
              form="checkout-form"
              className="checkout-place-order-button"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <div className="checkout-secure">

              <span>
                ✓
              </span>

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

export default Checkout;
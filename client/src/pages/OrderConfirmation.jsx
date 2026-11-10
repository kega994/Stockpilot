import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getOrderById } from "../services/orderService";
import "../styles/OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  const [loading, setLoading] = useState(
    !location.state?.order
  );

  const [error, setError] = useState("");

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

    // Fetch the order if it wasn't passed through navigation
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        setOrder(data.order);
      } catch (error) {
        console.error("Error loading order:", error);

        setError(
          error.message || "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!location.state?.order) {
      fetchOrder();
    }
  }, [id, location.pathname, location.state?.order, navigate]);

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <Header />

        <main className="confirmation-error">
          <h1>Loading your order...</h1>
          <p>Please wait while we retrieve your order details.</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page">
        <Header />

        <main className="confirmation-error">
          <h1>Order information unavailable</h1>

          <p>
            {error ||
              "We couldn't find the order details."}
          </p>

          <button onClick={() => navigate("/")}>
            Return to Store
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <Header />

      <main className="confirmation-container">
        <div className="confirmation-card">

          <div className="confirmation-icon">
            ✓
          </div>

          <p className="confirmation-label">
            ORDER CONFIRMED
          </p>

          <h1>
            Thank you for your order!
          </h1>

          <p className="confirmation-message">
            Your order has been placed successfully.
            We've received your order and will prepare
            it for delivery.
          </p>

          <div className="order-number">
            <span>Order Number</span>

            <strong>
              {order.order_number}
            </strong>
          </div>

          <div className="confirmation-details">

            <div>
              <span>Customer</span>

              <strong>
                {order.customer_name}
              </strong>
            </div>

            <div>
              <span>Email</span>

              <strong>
                {order.email}
              </strong>
            </div>

            <div>
              <span>Delivery</span>

              <strong>
                {order.address_line1}

                {order.address_line2 &&
                  `, ${order.address_line2}`}

                , {order.city}, {order.postcode}
              </strong>
            </div>

            <div>
              <span>Total</span>

              <strong>
                ${Number(order.total).toFixed(2)}
              </strong>
            </div>

          </div>

          <button
            className="confirmation-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>
      </main>
    </div>
  );
}

export default OrderConfirmation;
import { useContext, useState } from "react";
import BasketContext from "../context/BasketContext";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const { basket, logoutBasket } = useContext(BasketContext);

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const basketCount = basket.reduce(
    (total, item) => total + Number(item.basketQuantity || 0),
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const search = searchTerm.trim();

    if (!search) {
      return;
    }

    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  const handleLogout = () => {
    // Restore the guest basket before removing the login token
    logoutBasket();

    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <header className="site-header">

      {/* Main header */}

      <div className="header-inner">

        {/* Logo */}

        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          Stock<span>pilot</span>
        </div>

        {/* Search */}

        <form
          className="search-container"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search for products, brands and categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="submit"
            className="search-button"
          >
            🔍
          </button>
        </form>

        {/* Basket */}

        <div className="header-actions">

          <button
            className="basket-button"
            onClick={() => navigate("/checkout")}
          >
            <span className="basket-icon">
              🛒
            </span>

            <span className="basket-text">
              Basket
            </span>

            <span className="basket-count">
              {basketCount}
            </span>
          </button>

        </div>

      </div>

      {/* Navigation */}

      <nav className="main-nav">

        <div className="nav-inner">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button onClick={() => navigate("/products")}>
            Products
          </button>

          <button onClick={() => navigate("/checkout")}>
            Basket
          </button>

          {isLoggedIn ? (
            <button
              className="login-nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="login-nav-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </>
          )}

        </div>

      </nav>

    </header>
  );
}

export default Header;
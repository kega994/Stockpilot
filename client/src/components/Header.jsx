import { useContext } from "react";
import BasketContext from "../context/BasketContext";
import { useNavigate } from "react-router-dom";


function Header() {



const { basket } = useContext(BasketContext);
const navigate = useNavigate();

const basketCount = basket.reduce(
  (total, item) => total + item.basketQuantity,
  0
);

  return (
    <header>
      <h1>Stockpilot</h1>

      <input
        type="text"
        placeholder="Search products..."
      />

<button onClick={() => navigate("/checkout")}>
  🛒 {basketCount}
</button>
    </header>
  );
}

export default Header;
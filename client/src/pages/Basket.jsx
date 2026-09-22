import { useContext } from "react";
import BasketContext from "../context/BasketContext"


function Basket() {
  const { basket, increaseQuantity, decreaseQuantity } = useContext(BasketContext);
 


// Calculate the subtotal of the basket
const subtotal = basket.reduce((total, item) => {
  return total + Number(item.price) * item.basketQuantity;
}, 0);


  return (
    <div>
      <h1>Your Basket</h1>
      <ul>
        {basket.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.basketQuantity}</p>
            <button onClick={() => increaseQuantity(item.id)}>
              +
            </button>
            <button onClick={() => decreaseQuantity(item.id)}>
              -
            </button> 
          </li>
        ))}
      </ul>
      <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
    </div>
  );
}

export default Basket;
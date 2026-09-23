import {useContext} from "react";
import BasketContext from "../context/BasketContext";



function Checkoutpage() { 

const { basket, increaseQuantity, decreaseQuantity} = useContext(BasketContext);

const subtotal = basket.reduce((total, item) => {
  return total + Number(item.price) * item.basketQuantity;
}, 0);

  return (
    <div>
      <h1>Checkout Page</h1>
     <ul>
  {basket.map((item) => (
    <li key={item.id}>
      <h2>{item.name}</h2>
      <p>Price: ${Number(item.price).toFixed(2)}</p>
      <p>Quantity: {item.basketQuantity}</p>
      <p>
        Total: $
        {(Number(item.price) * item.basketQuantity).toFixed(2)}
      </p>
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

export default Checkoutpage;
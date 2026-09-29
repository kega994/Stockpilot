import { createContext, useState, useEffect } from "react";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState(() => {
  const savedBasket = localStorage.getItem("basket");

  return savedBasket ? JSON.parse(savedBasket) : [];
});

useEffect(() => {
  localStorage.setItem("basket", JSON.stringify(basket));
}, [basket]);


// Function to increase the quantity of a product in the basket
const increaseQuantity = (id) => {
  const updatedBasket = basket.map((item) => {

    if (item.basketQuantity >= item.quantity && item.id === id) {
      alert(
        `Cannot add more than available stock. Available stock: ${item.quantity}`
      );

      return item;
    }

    return item.id === id
      ? {
          ...item,
          basketQuantity: item.basketQuantity + 1
        }
      : item;
  });

  setBasket(updatedBasket);
};

// Function to decrease the quantity of a product in the basket
const decreaseQuantity = (id) => {
  const existingProduct = basket.find(
    (item) => item.id === id
  );

  if (existingProduct.basketQuantity > 1) {
    const updatedBasket = basket.map((item) =>
      item.id === id
        ? {
            ...item,
            basketQuantity: item.basketQuantity - 1
          }
        : item
    );

    setBasket(updatedBasket);
  } else {
    const updatedBasket = basket.filter(
      (item) => item.id !== id
    );

    setBasket(updatedBasket);
  }
};


// Function to add a product to the basket or increase its quantity if it already exists
const addToBasket = (product) => {
  const existingProduct = basket.find(
    (item) => item.id === product.id
  );

  // Product is out of stock
  if (product.quantity === 0) {
    alert("This product is currently out of stock.");
    return;
  }

  // Product is already in basket
  if (existingProduct) {
    // Basket has reached available stock
    if (existingProduct.basketQuantity >= product.quantity) {
      alert(
        `Cannot add more than available stock. Available stock: ${product.quantity}`
      );
      return;
    }

    const updatedBasket = basket.map((item) =>
      item.id === product.id
        ? {
            ...item,
            basketQuantity: item.basketQuantity + 1
          }
        : item
    );

    setBasket(updatedBasket);
  } else {
    // Product is not in basket yet
    setBasket([
      ...basket,
      {
        ...product,
        basketQuantity: 1
      }
    ]);
  }
};



  return (
    <BasketContext.Provider value={{ basket, setBasket, addToBasket, increaseQuantity, decreaseQuantity }}>
      {children}
    </BasketContext.Provider>
  );

 
};



export default BasketContext;
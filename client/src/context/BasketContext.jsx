import {
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";

const BasketContext = createContext();

const API_URL = "http://localhost:3000/api";

// Load the saved guest basket
const getSavedBasket = () => {
  try {
    let savedBasket = localStorage.getItem("guestBasket");

    if (!savedBasket) {
      savedBasket = localStorage.getItem("basket");

      if (savedBasket) {
        localStorage.setItem("guestBasket", savedBasket);
        localStorage.removeItem("basket");
      }
    }

    return savedBasket ? JSON.parse(savedBasket) : [];
  } catch (error) {
    console.error("Unable to load saved basket:", error);
    return [];
  }
};

// Send authenticated basket requests to the backend
const basketRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to access your basket.");
  }

  console.log("BASKET REQUEST:", `${API_URL}${url}`);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await response.json();

  console.log("BASKET RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.error || "Unable to update your basket.");
  }

  return data;
};

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState(getSavedBasket);
  const [isCustomerBasket, setIsCustomerBasket] = useState(false);
  const [basketLoading, setBasketLoading] = useState(true);

  // Save the guest basket only
  useEffect(() => {
    if (!isCustomerBasket) {
      localStorage.setItem("guestBasket", JSON.stringify(basket));
    }
  }, [basket, isCustomerBasket]);

  // Load the customer's basket from PostgreSQL
  const loadCustomerBasket = useCallback(async () => {
    const data = await basketRequest("/cart");

    setBasket(data.cart || []);
    setIsCustomerBasket(true);

    return data.cart || [];
  }, []);

  // Check whether a customer is logged in when the app opens
  useEffect(() => {
    const initialiseBasket = async () => {
      try {
        if (localStorage.getItem("token")) {
          await loadCustomerBasket();
        }
      } catch (error) {
        console.error("Unable to load customer basket:", error);
      } finally {
        setBasketLoading(false);
      }
    };

    initialiseBasket();
  }, [loadCustomerBasket]);

  // Merge the guest basket into the customer's database basket
  const syncGuestBasket = useCallback(async () => {
    const guestBasket = basket;

    console.log("SYNC GUEST BASKET CALLED");
    console.log("GUEST BASKET ITEMS:", guestBasket);
    console.log("TOKEN EXISTS:", Boolean(localStorage.getItem("token")));

    if (guestBasket.length > 0) {
      const items = guestBasket.map((item) => ({
        id: item.id,
        basketQuantity: item.basketQuantity
      }));

      console.log("ITEMS BEING SENT TO BACKEND:", items);

      const data = await basketRequest("/cart/merge", {
        method: "POST",
        body: JSON.stringify({ items })
      });

      console.log("MERGE RESPONSE:", data);

      localStorage.removeItem("guestBasket");
      localStorage.removeItem("basket");

      setBasket(data.cart || []);
      setIsCustomerBasket(true);

      return data.cart || [];
    }

    console.log("GUEST BASKET IS EMPTY - LOADING CUSTOMER BASKET");

    localStorage.removeItem("guestBasket");
    localStorage.removeItem("basket");

    return await loadCustomerBasket();
  }, [basket, loadCustomerBasket]);

  // Add a product
  const addToBasket = async (product) => {
    if (Number(product.quantity) <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    // Logged-in customer: save to database
    if (isCustomerBasket && localStorage.getItem("token")) {
      try {
        await basketRequest("/cart/add", {
          method: "POST",
          body: JSON.stringify({
            productId: product.id,
            quantity: 1
          })
        });

        await loadCustomerBasket();
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    // Guest: save to localStorage
    const existingProduct = basket.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      if (existingProduct.basketQuantity >= Number(product.quantity)) {
        alert(
          `Cannot add more than available stock. Available stock: ${product.quantity}`
        );
        return;
      }

      setBasket((currentBasket) =>
        currentBasket.map((item) =>
          item.id === product.id
            ? {
                ...item,
                basketQuantity: item.basketQuantity + 1,
                quantity: product.quantity
              }
            : item
        )
      );

      return;
    }

    setBasket((currentBasket) => [
      ...currentBasket,
      {
        ...product,
        basketQuantity: 1
      }
    ]);
  };

  // Increase quantity
  const increaseQuantity = async (id) => {
    const item = basket.find((product) => product.id === id);

    if (!item) return;

    if (item.basketQuantity >= Number(item.quantity)) {
      alert(
        `Cannot add more than available stock. Available stock: ${item.quantity}`
      );
      return;
    }

    if (isCustomerBasket && localStorage.getItem("token")) {
      try {
        await basketRequest(`/cart/update/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            quantity: item.basketQuantity + 1
          })
        });

        await loadCustomerBasket();
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setBasket((currentBasket) =>
      currentBasket.map((item) =>
        item.id === id
          ? {
              ...item,
              basketQuantity: item.basketQuantity + 1
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = async (id) => {
    const item = basket.find((product) => product.id === id);

    if (!item) return;

    if (isCustomerBasket && localStorage.getItem("token")) {
      try {
        if (item.basketQuantity <= 1) {
          await basketRequest(`/cart/remove/${id}`, {
            method: "DELETE"
          });
        } else {
          await basketRequest(`/cart/update/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              quantity: item.basketQuantity - 1
            })
          });
        }

        await loadCustomerBasket();
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setBasket((currentBasket) =>
      currentBasket
        .map((item) =>
          item.id === id
            ? {
                ...item,
                basketQuantity: item.basketQuantity - 1
              }
            : item
        )
        .filter((item) => item.basketQuantity > 0)
    );
  };

  // Remove a product completely
  const removeFromBasket = async (id) => {
    if (isCustomerBasket && localStorage.getItem("token")) {
      try {
        await basketRequest(`/cart/remove/${id}`, {
          method: "DELETE"
        });

        await loadCustomerBasket();
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setBasket((currentBasket) =>
      currentBasket.filter((item) => item.id !== id)
    );
  };

  // Clear the current basket
  const clearBasket = () => {
    setBasket([]);

    if (!isCustomerBasket) {
      localStorage.setItem("guestBasket", "[]");
    }
  };

  // Switch back to the guest basket when logging out
  const logoutBasket = () => {
    setIsCustomerBasket(false);
    setBasket(getSavedBasket());
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        setBasket,
        basketLoading,
        isCustomerBasket,
        addToBasket,
        increaseQuantity,
        decreaseQuantity,
        removeFromBasket,
        clearBasket,
        loadCustomerBasket,
        syncGuestBasket,
        logoutBasket
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContext;
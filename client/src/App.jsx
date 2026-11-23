import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import BasketPage from "./pages/BasketPage";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/products" element={<Products />} />

      <Route
        path="/products/add"
        element={<AddProduct />}
      />

      <Route
        path="/products/edit/:id"
        element={<EditProduct />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* Basket */}

      <Route
        path="/checkout"
        element={<BasketPage />}
      />

      {/* Checkout details */}

      <Route
        path="/checkout/details"
        element={<Checkout />}
      />

      {/* Order confirmation */}

      <Route
        path="/order-confirmation/:id"
        element={<OrderConfirmation />}
      />

    </Routes>
  );
}

export default App;
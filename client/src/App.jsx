import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkoutpage";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>


  );
}

export default App;
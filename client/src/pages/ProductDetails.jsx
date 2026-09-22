import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { useContext } from "react";
import BasketContext from "../context/BasketContext";



function ProductDetails() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToBasket } = useContext(BasketContext);

  useEffect(() =>{
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    loadProduct();
  }, [id])

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
  <>
    <h1>Product Details</h1>
    <div>
    <p><strong>Name:</strong> {product.name}</p>
    <p><strong>Description:</strong> {product.description}</p>
    <p><strong>SKU:</strong> {product.sku}</p>
    <p><strong>Price:</strong> ${product.price}</p>
    <p><strong>Quantity:</strong> {product.quantity}</p>
    <p><strong>Brand:</strong> {product.brand}</p>
    <p><strong>Category:</strong> {product.category}</p>
    <button onClick={() => addToBasket(product)}>Add to Basket</button>
    </div>
  </>
  )
  }

  export default ProductDetails;
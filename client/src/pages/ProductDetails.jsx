import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";


function ProductDetails() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);

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

  return <h1>{product?.name}</h1>;
  }

  export default ProductDetails;
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { useContext } from "react";
import BasketContext from "../context/BasketContext";
import Header from "../components/Header";




function Home() {

  const { addToBasket } = useContext(BasketContext);
  const [products, setProducts] = useState([]);


  useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  loadProducts();
}, []);

console.log(products);

  return <>
    <div>
      < Header />
      <h1>Welcome to Stockpilot</h1>
    </div>
    <div>
  {products.map((product) => (
    <div key={product.id}>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>${product.price}</p>
      <button onClick={() => addToBasket(product)}>
        Add to Basket
      </button>
    </div>
  ))}
</div>
</>
}

export default Home;
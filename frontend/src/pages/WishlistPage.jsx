import { useEffect, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {
        setError("Không thể tải danh sách yêu thích.");
      });
  }, []);

  return (
    <main className="container page-padding">
      <h1>Sản phẩm yêu thích</h1>
      {error ? <p className="panel">{error}</p> : <ProductGrid products={products} />}
    </main>
  );
}

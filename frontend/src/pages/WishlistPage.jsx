import { useEffect, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {
      setError("Khong the tai danh sach wishlist.");
    });
  }, []);

  return (
    <main className="container page-padding">
      <h1>Saved Treasures</h1>
      {error ? <p className="panel">{error}</p> : <ProductGrid products={products} />}
    </main>
  );
}

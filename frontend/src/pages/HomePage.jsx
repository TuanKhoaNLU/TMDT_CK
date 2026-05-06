import { useEffect, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {
      setError("Khong the tai danh sach san pham.");
    });
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Curated Handmade Templates</h1>
        <p className="muted">
          Marketplace model cho san pham handmade, ho tro mua san va dat custom.
        </p>
      </section>
      {error ? <p className="panel">{error}</p> : <ProductGrid products={products} />}
    </main>
  );
}

import { useEffect, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {
        setError("Không thể tải danh sách sản phẩm.");
      });
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Sản phẩm thủ công tuyển chọn</h1>
        <p className="muted">
          Sàn dành cho sản phẩm handmade Việt Nam, hỗ trợ mua sẵn và đặt làm theo
          yêu cầu.
        </p>
      </section>
      {error ? <p className="panel">{error}</p> : <ProductGrid products={products} />}
    </main>
  );
}

import { useEffect, useState } from "react";
import { fetchAdminProducts, updateAdminProductStatus } from "../../api.js";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchAdminProducts()
      .then(setItems)
      .catch(() => setError("Khong tai duoc san pham."));
  };

  useEffect(load, []);

  const toggle = async (id, current) => {
    const next = current === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    try {
      await updateAdminProductStatus(id, next);
      load();
    } catch {
      setError("Khong cap nhat duoc trang thai.");
    }
  };

  return (
    <main className="container page-padding">
      <h1>Kiem duyet san pham</h1>
      {error && <p className="panel">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ten</th>
            <th>Danh muc</th>
            <th>Gia</th>
            <th>Shop</th>
            <th>Trang thai</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>{item.shopId}</td>
              <td>
                <span className={`badge ${item.status === "ACTIVE" ? "ok" : "off"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button className="btn ghost" onClick={() => toggle(item.id, item.status)}>
                  {item.status === "ACTIVE" ? "An" : "Hien"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

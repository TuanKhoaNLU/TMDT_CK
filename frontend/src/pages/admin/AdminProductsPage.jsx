import { useEffect, useState } from "react";
import { fetchAdminProducts, updateAdminProductStatus } from "../../api.js";
import { formatVnd } from "../../utils/format.js";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchAdminProducts()
      .then(setItems)
      .catch(() => setError("Không tải được sản phẩm."));
  };

  useEffect(load, []);

  const toggle = async (id, current) => {
    const next = current === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    try {
      await updateAdminProductStatus(id, next);
      load();
    } catch {
      setError("Không cập nhật được trạng thái.");
    }
  };

  return (
    <main className="container page-padding">
      <h1>Kiểm duyệt sản phẩm</h1>
      {error && <p className="panel">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Cửa hàng</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{formatVnd(item.price)}</td>
              <td>{item.shopId}</td>
              <td>
                <span className={`badge ${item.status === "ACTIVE" ? "ok" : "off"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button
                  className="btn ghost"
                  onClick={() => toggle(item.id, item.status)}
                >
                  {item.status === "ACTIVE" ? "Ẩn" : "Hiện"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

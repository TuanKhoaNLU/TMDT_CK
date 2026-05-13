import { useEffect, useState } from "react";
import {
  createSellerProduct,
  deleteSellerProduct,
  fetchSellerProducts,
  updateSellerProduct,
} from "../../api.js";
import { useSeller } from "../../context/useSeller.js";
import { formatVnd } from "../../utils/format.js";

const emptyForm = {
  name: "",
  category: "",
  price: 0,
  customizable: false,
  image: "",
  artisan: "",
  stock: 0,
  status: "ACTIVE",
};

export default function SellerProductsPage() {
  const { shopId } = useSeller();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    fetchSellerProducts(shopId)
      .then(setItems)
      .catch(() => setError("Không tải được danh sách sản phẩm."));
  };

  useEffect(load, [shopId]);

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      customizable: item.customizable,
      image: item.image,
      artisan: item.artisan,
      stock: item.stock,
      status: item.status,
    });
  };

  const startCreate = () => {
    setEditing("new");
    setForm({ ...emptyForm, artisan: items[0]?.artisan ?? "" });
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing === "new") {
        await createSellerProduct(shopId, form);
      } else {
        await updateSellerProduct(shopId, editing, form);
      }
      cancel();
      load();
    } catch {
      setError("Không lưu được sản phẩm.");
    }
  };

  const remove = async (id) => {
    if (!confirm("Xoá sản phẩm này?")) return;
    try {
      await deleteSellerProduct(shopId, id);
      load();
    } catch {
      setError("Không xoá được sản phẩm.");
    }
  };

  return (
    <main className="container page-padding">
      <div className="row-between">
        <h1>Sản phẩm của cửa hàng</h1>
        <button className="btn" onClick={startCreate}>
          + Thêm sản phẩm
        </button>
      </div>
      {error && <p className="panel">{error}</p>}
      {editing && (
        <form className="panel mb-16" onSubmit={save}>
          <h3>{editing === "new" ? "Thêm mới" : `Cập nhật #${editing}`}</h3>
          <input
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Danh mục"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            placeholder="Nghệ nhân"
            value={form.artisan}
            onChange={(e) => setForm({ ...form, artisan: e.target.value })}
            required
          />
          <input
            placeholder="Đường dẫn ảnh"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="number"
            step="1"
            placeholder="Giá (vnd)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="Tồn kho"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
          <label className="muted inline-check">
            <input
              type="checkbox"
              checked={form.customizable}
              onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
            />{" "}
            Cho phép đặt theo yêu cầu
          </label>
          <div className="row-gap mt-8">
            <button type="submit" className="btn">
              Lưu
            </button>
            <button type="button" className="btn ghost" onClick={cancel}>
              Huỷ
            </button>
          </div>
        </form>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn</th>
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
              <td>{item.stock}</td>
              <td>
                <span className={`badge ${item.status === "ACTIVE" ? "ok" : "off"}`}>
                  {item.status}
                </span>
              </td>
              <td className="row-gap">
                <button className="btn ghost" onClick={() => startEdit(item)}>
                  Sửa
                </button>
                <button className="btn ghost" onClick={() => remove(item.id)}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="7" className="muted">
                Chưa có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

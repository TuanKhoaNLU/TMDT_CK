import { useEffect, useState } from "react";
import {
  createSellerProduct,
  deleteSellerProduct,
  fetchSellerProducts,
  updateSellerProduct,
} from "../../api.js";
import { useSeller } from "../../context/useSeller.js";

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
      .catch(() => setError("Khong tai duoc san pham."));
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
      setError("Khong luu duoc san pham.");
    }
  };

  const remove = async (id) => {
    if (!confirm("Xoa san pham nay?")) return;
    try {
      await deleteSellerProduct(shopId, id);
      load();
    } catch {
      setError("Khong xoa duoc san pham.");
    }
  };

  return (
    <main className="container page-padding">
      <div className="row-between">
        <h1>San pham cua shop</h1>
        <button className="btn" onClick={startCreate}>+ Them san pham</button>
      </div>
      {error && <p className="panel">{error}</p>}
      {editing && (
        <form className="panel mb-16" onSubmit={save}>
          <h3>{editing === "new" ? "Them moi" : `Cap nhat #${editing}`}</h3>
          <input
            placeholder="Ten san pham"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Danh muc"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            placeholder="Artisan"
            value={form.artisan}
            onChange={(e) => setForm({ ...form, artisan: e.target.value })}
            required
          />
          <input
            placeholder="Anh URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Gia"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="Ton kho"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
          <label className="muted inline-check">
            <input
              type="checkbox"
              checked={form.customizable}
              onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
            />{" "}
            Cho phep custom
          </label>
          <div className="row-gap mt-8">
            <button type="submit" className="btn">Luu</button>
            <button type="button" className="btn ghost" onClick={cancel}>Huy</button>
          </div>
        </form>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ten</th>
            <th>Danh muc</th>
            <th>Gia</th>
            <th>Ton</th>
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
              <td>{item.stock}</td>
              <td>
                <span className={`badge ${item.status === "ACTIVE" ? "ok" : "off"}`}>
                  {item.status}
                </span>
              </td>
              <td className="row-gap">
                <button className="btn ghost" onClick={() => startEdit(item)}>Sua</button>
                <button className="btn ghost" onClick={() => remove(item.id)}>Xoa</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="7" className="muted">Chua co san pham.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

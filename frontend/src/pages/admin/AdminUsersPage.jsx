import { useEffect, useState } from "react";
import { fetchAdminShops, fetchAdminUsers } from "../../api.js";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminShops()])
      .then(([u, s]) => {
        setUsers(u);
        setShops(s);
      })
      .catch(() => setError("Khong tai duoc danh sach."));
  }, []);

  const shopName = (shopId) => shops.find((s) => s.id === shopId)?.name ?? "-";

  return (
    <main className="container page-padding">
      <h1>Quan ly nguoi dung</h1>
      {error && <p className="panel">{error}</p>}
      <h2>Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ten</th>
            <th>Email</th>
            <th>Vai tro</th>
            <th>Shop</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td><span className="badge ok">{u.role}</span></td>
              <td>{u.shopId ? shopName(u.shopId) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8">Shops</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ten shop</th>
            <th>Chu</th>
            <th>Mo ta</th>
            <th>Dia chi</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.ownerName}</td>
              <td>{s.description}</td>
              <td>{s.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

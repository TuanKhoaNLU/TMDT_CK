import { useAuth } from "../context/useAuth.js";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <main className="container profile-container">
      <h1>Thông tin tài khoản</h1>
      <div className="panel">
        <label className="muted small">Họ và tên</label>
        <input defaultValue={user?.fullName ?? ""} />
        <label className="muted small">Email</label>
        <input defaultValue={user?.email ?? ""} />
        <label className="muted small">Số điện thoại</label>
        <input defaultValue="+84 0987 654 321" />
        <label className="muted small">Địa chỉ</label>
        <input defaultValue="128 Lê Lợi, Quận 1, TP. Hồ Chí Minh" />
        <button className="btn">Lưu thay đổi</button>
      </div>
    </main>
  );
}

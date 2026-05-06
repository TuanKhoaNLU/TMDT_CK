export default function LoginPage() {
  return (
    <main className="container login-container">
      <h1>Welcome Back</h1>
      <p className="muted">Dang nhap de truy cap studio</p>
      <div className="panel">
        <input placeholder="Email Address" />
        <input placeholder="Password" type="password" />
        <button className="btn full-width">Sign In</button>
      </div>
    </main>
  );
}

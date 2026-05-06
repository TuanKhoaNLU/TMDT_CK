export default function CustomizePage() {
  return (
    <main className="container page-padding">
      <div className="two-col">
        <div className="panel">
          <div className="ph h-420"></div>
        </div>
        <div className="panel">
          <h2>Hand-Carved Earthen Vase</h2>
          <p className="muted">Nhap noi dung khac ca nhan</p>
          <input placeholder="Enter your message" />
          <p className="muted">Note for the artisan</p>
          <textarea rows="5" placeholder="Describe details..."></textarea>
          <h3>Total: $320.00</h3>
          <button className="btn full-width">Review & Add To Bag</button>
        </div>
      </div>
    </main>
  );
}

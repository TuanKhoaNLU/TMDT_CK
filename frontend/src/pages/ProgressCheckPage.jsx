export default function ProgressCheckPage() {
  return (
    <main className="container page-padding">
      <h1>Duyệt bản phác thảo</h1>
      <div className="two-col">
        <div className="panel">
          <div className="ph h-460"></div>
        </div>
        <div className="panel">
          <p className="muted">
            Đơn đặt riêng đang ở giai đoạn phác thảo.
          </p>
          <h3>Bình gốm "Terra & Thread" - 4.200.000 vnd</h3>
          <button className="btn full-width mb-10">Duyệt bản phác thảo</button>
          <button className="btn ghost full-width">Yêu cầu chỉnh sửa</button>
        </div>
      </div>
    </main>
  );
}

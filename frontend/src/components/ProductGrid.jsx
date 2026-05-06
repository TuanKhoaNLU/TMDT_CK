export default function ProductGrid({ products }) {
  return (
    <section id="product-list" className="grid">
      {products.map((product) => (
        <article className="card" key={product.id}>
          <div className="ph"></div>
          <div className="card-body">
            <h3>{product.name}</h3>
            <p className="muted">
              {product.category} • {product.artisan}
            </p>
            <strong>${Number(product.price).toFixed(2)}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

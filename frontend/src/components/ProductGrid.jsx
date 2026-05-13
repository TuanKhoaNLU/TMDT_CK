import { formatVnd } from "../utils/format.js";

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
            <strong>{formatVnd(product.price)}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

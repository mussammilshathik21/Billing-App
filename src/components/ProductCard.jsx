import "../styles/product.css";

export default function ProductCard({ product, addToBill }) {

  // ============================================================
  // Stock check — when Supabase is ready, stock will come
  // from the DB row directly. Same field name: product.stock
  // ============================================================
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleClick = () => {
    if (isOutOfStock) return;
    addToBill(product);
  };

  return (
    <div
      className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}
      onClick={handleClick}
    >
      {/* VEG / NON-VEG DOT */}
      <span className={`type-dot ${product.type === "veg" ? "dot-veg" : "dot-nonveg"}`} />

      {/* IMAGE */}
      <img src={product.image} alt={product.name} />

      {/* TEXT */}
      <div className="text">
        <p className="code-tag">#{product.code}</p>
        <h4>{product.name}</h4>
        <p className="price">₹{product.price}</p>

        {/* STOCK BADGE */}
        {isOutOfStock ? (
          <span className="stock-badge out">Out of Stock</span>
        ) : (
          <span className="stock-badge in">Stock: {product.stock}</span>
        )}
      </div>
    </div>
  );
}

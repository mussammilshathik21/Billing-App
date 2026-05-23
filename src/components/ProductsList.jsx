export default function ProductList({
  products,
  setProducts
}) {

  const remove = (i) => {
    setProducts(
      products.filter((_, index) => index !== i)
    );
  };

  return (
    <div>

      {products.map((p, i) => (

        <div key={i} className="card">

          <span>
            {p.name} - ₹{p.price}
          </span>

          <button onClick={() => remove(i)}>
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}
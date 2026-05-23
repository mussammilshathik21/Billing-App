import "../styles/billtable.css";

export default function BillTable({
  bill,
  setBill
}) {

  // ➕ Increase
  const increaseQty = (id) => {

    setBill(
      bill.map((item)=>
        item.id === id
          ? {
              ...item,
              qty:item.qty + 1
            }
          : item
      )
    );
  };

  // ➖ Decrease
  const decreaseQty = (id) => {

    setBill(
      bill
        .map((item)=>
          item.id === id
            ? {
                ...item,
                qty:item.qty - 1
              }
            : item
        )
        .filter((item)=> item.qty > 0)
    );
  };

  // ❌ Remove
  const removeItem = (id) => {

    setBill(
      bill.filter(
        (item)=> item.id !== id
      )
    );
  };

  // 💰 Total
  const total = bill.reduce(
    (a,b)=>
      a + b.price * b.qty,
    0
  );

  return (

    <div className="bill-table-container">

      <table>

        <thead>

          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>

        </thead>

        <tbody>

          {bill.length > 0 ? (

            bill.map((item)=>(

              <tr key={item.id}>

                {/* Product */}
                <td className="product-name">
                  {item.name}
                </td>

                {/* Qty */}
                <td>

                  <div className="qty-box">

                    <button
                      className="minus-btn"
                      onClick={() =>
                        decreaseQty(item.id)
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.qty}
                    </span>

                    <button
                      className="plus-btn"
                      onClick={() =>
                        increaseQty(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                </td>

                {/* Total */}
                <td>
                  ₹{
                    item.price * item.qty
                  }
                </td>

                {/* Remove */}
                <td>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    ❌
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="4"
                className="empty"
              >
                No Products Added
              </td>

            </tr>

          )}

        </tbody>

      </table>

      {/* Grand Total */}
      <h2 className="grand-total">
        Total : ₹{total}
      </h2>

    </div>
  );
}

export const generateInvoice = (bill = []) => {

  if (!bill.length) {

    alert("No items to generate invoice");

    return;
  }

  // =========================
  // BILL NUMBER
  // =========================

  let billCounter =

    Number(
      localStorage.getItem(
        "billCounter"
      )
    ) || 1;

  const billNo = billCounter;

  localStorage.setItem(

    "billCounter",

    billCounter + 1

  );

  // =========================
  // DATE & TIME
  // =========================

  const now = new Date();

  const date =
    now.toLocaleDateString();

  const time =
    now.toLocaleTimeString();

  // =========================
  // TOTAL
  // =========================

  let grandTotal = 0;

  // =========================
  // ITEMS
  // =========================

  const itemsHTML = bill

    .map((item, index) => {

      const amount =
        item.price * item.qty;

      grandTotal += amount;

      return `

        <tr>

          <td class="item-col">

            ${index + 1}.
            ${item.name}

          </td>

          <td class="qty-col">

            ${item.qty}

          </td>

          <td class="rate-col">

            ${item.price}

          </td>

          <td class="amt-col">

            ${amount}

          </td>

        </tr>

      `;
    })

    .join("");

  // =========================
  // SAVE HISTORY
  // =========================

  const oldHistory =

    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  const historyItem = {

    id: billNo,

    date: `${date} ${time}`,

    items: bill,

    total: grandTotal
  };

  oldHistory.push(historyItem);

  localStorage.setItem(

    "history",

    JSON.stringify(oldHistory)

  );

  // =========================
  // PRINT WINDOW
  // =========================

  const printWindow =

    window.open(
      "",
      "",
      "width=300,height=600"
    );

  printWindow.document.write(`

    <html>

      <head>

        <title>

          Invoice

        </title>

        <style>

          /* =========================
             PAGE
          ========================= */

          @page{

            size:58mm auto;

            margin:0;
          }

          body{

            font-family: Arial, sans-serif;

            width:58mm;

            margin:0 auto;

            padding:2px;

            color:black;

            font-size:10px;
          }

          /* =========================
             SHOP HEADER
          ========================= */

          .shop-header{

            text-align:center;

            margin-bottom:8px;
          }

          .shop-name{

            font-size:18px;

            font-weight:bold;

            line-height:1.2;
          }

          .shop-address{

            font-size:9px;

            margin-top:4px;
          }

          .shop-phone{

            font-size:9px;

            margin-top:2px;
          }

          /* =========================
             TOP DETAILS
          ========================= */

          .top-details{

            display:flex;

            justify-content:space-between;

            margin-top:8px;

            font-size:9px;
          }

          .bill-no{

            font-weight:bold;
          }

          /* =========================
             TABLE
          ========================= */

          table{

            width:100%;

            border-collapse:collapse;

            margin-top:8px;
          }

          th{

            border-top:
              1px dashed black;

            border-bottom:
              1px dashed black;

            padding:5px 1px;

            font-size:9px;
          }

          td{

            padding:5px 1px;

            font-size:9px;

            overflow:hidden;
          }

          /* =========================
             COLUMN WIDTH
          ========================= */

          .item-col{

            width:40%;

            text-align:left;

            word-break:break-word;
          }

          .qty-col{

            width:12%;

            text-align:center;
          }

          .rate-col{

            width:20%;

            text-align:center;
          }

          .amt-col{

            width:28%;

            text-align:right;

            font-weight:bold;

            padding-right:2px;
          }

          /* =========================
             LINE
          ========================= */

          hr{

            border:none;

            border-top:
              1px dashed black;

            margin:6px 0;
          }

          /* =========================
             TOTAL
          ========================= */

          .summary{

            margin-top:6px;
          }

          .total{

            display:flex;

            justify-content:space-between;

            font-size:12px;

            font-weight:bold;
          }

          /* =========================
             FOOTER
          ========================= */

          .footer{

            text-align:center;

            margin-top:10px;

            font-size:10px;

            font-weight:bold;
          }

          /* =========================
             PRINT
          ========================= */

          @media print{

            html,
            body{

              width:58mm;

              overflow:hidden;
            }
          }

        </style>

      </head>

      <body>

        <!-- SHOP -->

        <div class="shop-header">

          <div class="shop-name">

            JAF Hot Chicken & Bakery

          </div>

          <div class="shop-address">

            Shencottai,
            Gandhi Statue Opposite

          </div>

          <div class="shop-phone">

            PH : 8015552799

          </div>

        </div>

        <!-- DETAILS -->

        <div class="top-details">

          <div class="bill-no">

            Bill No :
            ${billNo}

          </div>

          <div>

            ${date}
            <br />

            ${time}

          </div>

        </div>

        <!-- TABLE -->

        <table>

          <thead>

            <tr>

              <th class="item-col">

                Item

              </th>

              <th class="qty-col">

                Qty

              </th>

              <th class="rate-col">

                Rate

              </th>

              <th class="amt-col">

                Amt

              </th>

            </tr>

          </thead>

          <tbody>

            ${itemsHTML}

          </tbody>

        </table>

        <hr />

        <!-- TOTAL -->

        <div class="summary">

          <div class="total">

            <span>

              TOTAL

            </span>

            <span>

              ₹${grandTotal.toFixed(2)}

            </span>

          </div>

        </div>

        <hr />

        <!-- FOOTER -->

        <div class="footer">

          Thank You Visit Again ❤️

        </div>

      </body>

    </html>

  `);

  printWindow.document.close();

  // =========================
  // PRINT
  // =========================

  setTimeout(() => {

    printWindow.focus();

    printWindow.print();

    printWindow.close();

  }, 500);

};

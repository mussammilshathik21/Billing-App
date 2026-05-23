// ============================================================
// SALES REPORT PDF GENERATOR
// Uses browser's print window — no external library needed.
// When Supabase is ready, history data will come from DB,
// but this function signature stays the same:
//   generateSalesReport(filteredHistory, reportTitle, reportMeta)
// ============================================================

export const generateSalesReport = (history = [], reportTitle = "Sales Report", reportMeta = {}) => {
  if (!history || history.length === 0) {
    alert("No sales data found for the selected period.");
    return;
  }

  // ── SUMMARY CALCULATIONS ──────────────────────────────────
  const totalRevenue = history.reduce((sum, b) => sum + (b.total || 0), 0);
  const totalBills   = history.length;

  let totalQty = 0;
  const productMap  = {};  // name → { qty, revenue, category }
  const categoryMap = {};  // category → revenue
  const dailyMap    = {};  // date-string → revenue

  history.forEach((bill) => {
    const dateKey = bill.date ? bill.date.split(" ")[0] : "Unknown";
    dailyMap[dateKey] = (dailyMap[dateKey] || 0) + (bill.total || 0);

    (bill.items || []).forEach((item) => {
      totalQty += item.qty;

      // Product aggregation
      if (!productMap[item.name]) {
        productMap[item.name] = { qty: 0, revenue: 0, category: item.category || "–" };
      }
      productMap[item.name].qty     += item.qty;
      productMap[item.name].revenue += item.price * item.qty;

      // Category aggregation
      const cat = item.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.qty);
    });
  });

  const avgBillValue = totalBills > 0 ? (totalRevenue / totalBills).toFixed(2) : 0;

  // Top 10 products by revenue
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10);

  // Category breakdown sorted by revenue
  const categoryRows = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1]);

  // Daily breakdown sorted by date
  const dailyRows = Object.entries(dailyMap)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]));

  // All bills table rows
  const allBillRows = [...history]
    .sort((a, b) => b.id - a.id)
    .map((b) => `
      <tr>
        <td>${b.id}</td>
        <td>${b.date || "–"}</td>
        <td>${(b.items || []).map(i => `${i.name} x${i.qty}`).join(", ")}</td>
        <td style="text-align:right;font-weight:600;">₹${(b.total || 0).toLocaleString()}</td>
      </tr>
    `).join("");

  // ── HTML ──────────────────────────────────────────────────
  const now = new Date();
  const generatedAt = now.toLocaleString("en-IN");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    @page { size: A4; margin: 15mm 12mm; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a2e; background: white; }

    /* ── HEADER ── */
    .header { background: #1a1a2e; color: white; padding: 18px 20px 14px; border-radius: 6px; margin-bottom: 16px; }
    .shop-name { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; }
    .shop-sub  { font-size: 10px; color: #aab4d0; margin-top: 3px; }
    .report-title { font-size: 15px; font-weight: 700; margin-top: 10px; color: #f0c040; }
    .report-meta  { font-size: 10px; color: #ccc; margin-top: 3px; }

    /* ── SUMMARY CARDS ── */
    .cards { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    .card  { flex: 1; min-width: 110px; background: #f8f9ff; border: 1px solid #dde3f5; border-radius: 8px; padding: 12px; text-align: center; }
    .card-val   { font-size: 18px; font-weight: 800; color: #1a1a2e; }
    .card-label { font-size: 9px; color: #888; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ── SECTION HEADER ── */
    .section-title {
      background: #e94560; color: white; padding: 6px 12px;
      font-size: 11px; font-weight: 700; border-radius: 4px;
      margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* ── TABLES ── */
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 4px; }
    thead tr { background: #2f3542; color: white; }
    th { padding: 6px 8px; text-align: left; font-weight: 700; font-size: 9px; text-transform: uppercase; }
    td { padding: 5px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
    tr:nth-child(even) td { background: #f7f8fc; }
    tr:last-child td { border-bottom: none; }

    /* Rank column */
    .rank { width: 28px; color: #888; text-align: center; }
    .bold { font-weight: 700; }
    .green { color: #27ae60; font-weight: 700; }
    .right { text-align: right; }

    /* ── FOOTER ── */
    .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px dashed #ddd; padding-top: 8px; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="shop-name">JAF Hot Chicken &amp; Bakery</div>
    <div class="shop-sub">Shencottai, Gandhi Statue Opposite &nbsp;|&nbsp; PH: 8015552799</div>
    <div class="report-title">📊 ${reportTitle}</div>
    <div class="report-meta">${reportMeta.label || ""} &nbsp;·&nbsp; Generated: ${generatedAt}</div>
  </div>

  <!-- SUMMARY CARDS -->
  <div class="cards">
    <div class="card">
      <div class="card-val">₹${totalRevenue.toLocaleString()}</div>
      <div class="card-label">Total Revenue</div>
    </div>
    <div class="card">
      <div class="card-val">${totalBills}</div>
      <div class="card-label">Total Bills</div>
    </div>
    <div class="card">
      <div class="card-val">${totalQty}</div>
      <div class="card-label">Items Sold</div>
    </div>
    <div class="card">
      <div class="card-val">₹${Number(avgBillValue).toLocaleString()}</div>
      <div class="card-label">Avg Bill Value</div>
    </div>
    <div class="card">
      <div class="card-val">${categoryRows.length}</div>
      <div class="card-label">Categories</div>
    </div>
  </div>

  <!-- TOP 10 PRODUCTS -->
  <div class="section-title">🏆 Top 10 Products by Revenue</div>
  <table>
    <thead>
      <tr><th class="rank">#</th><th>Product Name</th><th>Category</th><th class="right">Qty Sold</th><th class="right">Revenue</th></tr>
    </thead>
    <tbody>
      ${topProducts.map(([name, d], i) => `
        <tr>
          <td class="rank bold">${i + 1}</td>
          <td class="bold">${name}</td>
          <td style="color:#666">${d.category}</td>
          <td class="right">${d.qty}</td>
          <td class="right green">₹${d.revenue.toLocaleString()}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <!-- CATEGORY BREAKDOWN -->
  <div class="section-title">📂 Sales by Category</div>
  <table>
    <thead>
      <tr><th>Category</th><th class="right">Revenue</th><th class="right">% of Total</th></tr>
    </thead>
    <tbody>
      ${categoryRows.map(([cat, rev]) => `
        <tr>
          <td>${cat}</td>
          <td class="right green">₹${rev.toLocaleString()}</td>
          <td class="right" style="color:#888">${totalRevenue > 0 ? ((rev/totalRevenue)*100).toFixed(1) : 0}%</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <!-- DAILY BREAKDOWN -->
  ${dailyRows.length > 1 ? `
  <div class="section-title">📅 Daily Revenue Breakdown</div>
  <table>
    <thead>
      <tr><th>Date</th><th class="right">Revenue</th></tr>
    </thead>
    <tbody>
      ${dailyRows.map(([date, rev]) => `
        <tr>
          <td>${date}</td>
          <td class="right green">₹${rev.toLocaleString()}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  ` : ""}

  <!-- ALL BILLS -->
  <div class="section-title">🧾 All Bills in This Period</div>
  <table>
    <thead>
      <tr><th style="width:50px">Bill #</th><th style="width:130px">Date &amp; Time</th><th>Items</th><th class="right" style="width:80px">Total</th></tr>
    </thead>
    <tbody>
      ${allBillRows}
    </tbody>
  </table>

  <div class="footer">
    JAF Hot Chicken &amp; Bakery — Sales Report &nbsp;|&nbsp; ${reportTitle} &nbsp;|&nbsp; Printed: ${generatedAt}
  </div>

</body>
</html>`;

  // ── OPEN PRINT WINDOW ─────────────────────────────────────
  const win = window.open("", "", "width=900,height=700");
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 600);
};

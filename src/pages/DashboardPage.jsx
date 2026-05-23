import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { generateSalesReport } from "../utils/salesReport";
import { supabase } from "../supabaseClient";

// ============================================================
// DASHBOARD PAGE — Supabase connected
// Loads bills from 'bills' table for stats and reports
// ============================================================

export default function DashboardPage() {

  const [history, setHistory]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [showModal, setShowModal]     = useState(false);
  const [reportType, setReportType]   = useState("");
  const [reportDate, setReportDate]   = useState("");
  const [reportMonth, setReportMonth] = useState("");
  const [reportYear, setReportYear]   = useState("");

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // =========================
  // LOAD BILLS FROM SUPABASE
  // =========================
  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load bills error:", error.message);
    } else {
      // Normalize: map DB rows to the shape the rest of the code expects
      const normalized = (data || []).map((row) => ({
        id: row.bill_number || row.id,
        date: row.date,
        items: row.items || [],
        total: row.total || 0,
        created_at: row.created_at,
      }));
      setHistory(normalized);
    }
    setLoading(false);
  };

  useEffect(() => { loadHistory(); }, []);

  // =========================
  // RESET BILL NUMBER
  // =========================
  const resetBillCounter = async () => {
    if (!confirm("Reset bill number to 1?")) return;
    const { error } = await supabase
      .from("bill_counter")
      .update({ value: 0 })
      .eq("id", 1);
    if (error) {
      alert("Reset failed: " + error.message);
    } else {
      alert("Bill number reset to 1");
    }
  };

  // =========================
  // STATS
  // =========================
  const totalSales   = history.reduce((a, b) => a + (b.total || 0), 0);
  const totalBills   = history.length;
  const today        = new Date().toLocaleDateString("en-IN");
  const todaySales   = history
    .filter((b) => b.date && b.date.includes(today))
    .reduce((a, b) => a + (b.total || 0), 0);

  let totalProducts = 0;
  const productCount = {};
  history.forEach((bill) => {
    (bill.items || []).forEach((item) => {
      totalProducts += item.qty;
      productCount[item.name] = (productCount[item.name] || 0) + item.qty;
    });
  });

  let topProduct = "No Sales", topCount = 0;
  for (let p in productCount) {
    if (productCount[p] > topCount) { topCount = productCount[p]; topProduct = p; }
  }

  const recentBills = history.slice(0, 5);

  // =========================
  // GENERATE REPORT
  // =========================
  const handleGenerateReport = () => {
    let filtered = [];
    let title = "Sales Report";
    let label = "";

    if (reportType === "date") {
      if (!reportDate) { alert("Please select a date."); return; }
      const d = new Date(reportDate).toLocaleDateString("en-IN");
      filtered = history.filter((b) => b.date && b.date.includes(d));
      title = `Daily Sales Report — ${d}`;
      label = `Date: ${d}`;
    } else if (reportType === "month") {
      if (!reportMonth) { alert("Please select a month."); return; }
      const [yr, mo] = reportMonth.split("-");
      const monthName = new Date(Number(yr), Number(mo) - 1)
        .toLocaleString("en-IN", { month: "long", year: "numeric" });
      filtered = history.filter((b) => {
        if (!b.date) return false;
        const parts = b.date.split("/");
        if (parts.length === 3) return parts[1] === mo && parts[2].startsWith(yr);
        return b.date.includes(`${mo}/${yr}`) || b.date.includes(`${mo}-${yr}`);
      });
      title = `Monthly Sales Report — ${monthName}`;
      label = `Month: ${monthName}`;
    } else if (reportType === "year") {
      if (!reportYear) { alert("Please select a year."); return; }
      filtered = history.filter((b) => b.date && b.date.includes(reportYear));
      title = `Yearly Sales Report — ${reportYear}`;
      label = `Year: ${reportYear}`;
    } else if (reportType === "full") {
      filtered = history;
      title = "Full Sales Report — All Time";
      label = `All ${history.length} bills`;
    }

    if (filtered.length === 0) {
      alert("No sales data found for the selected period.");
      return;
    }
    setShowModal(false);
    generateSalesReport(filtered, title, { label });
  };

  const years = [...new Set(
    history.map((b) => {
      if (!b.date) return null;
      const parts = b.date.split("/");
      return parts.length >= 3 ? parts[2].split(" ")[0] : null;
    }).filter(Boolean)
  )].sort((a, b) => b - a);

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1>Sales Dashboard</h1>
          <p className="live-date">
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="live-time">{currentTime.toLocaleTimeString()}</div>
      </div>

      <div className="dashboard-actions">
        <button className="report-btn" onClick={() => setShowModal(true)}>
          📥 Download Sales Report
        </button>
        <button className="reset-btn" onClick={resetBillCounter}>
          🔄 Reset Bill No
        </button>
        <button className="report-btn" onClick={loadHistory} style={{background:"#555"}}>
          🔄 Refresh Data
        </button>
      </div>

      {loading && (
        <p style={{ color: "#999", padding: "10px 0" }}>⏳ Loading from database…</p>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card card-green">
          <h3>💰 Total Sales</h3>
          <h2>₹{totalSales.toLocaleString()}</h2>
        </div>
        <div className="dashboard-card card-blue">
          <h3>📅 Today Sales</h3>
          <h2>₹{todaySales.toLocaleString()}</h2>
        </div>
        <div className="dashboard-card card-orange">
          <h3>🧾 Total Bills</h3>
          <h2>{totalBills}</h2>
        </div>
        <div className="dashboard-card card-purple">
          <h3>🍔 Items Sold</h3>
          <h2>{totalProducts}</h2>
        </div>
        <div className="dashboard-card card-red">
          <h3>🔥 Top Product</h3>
          <h2 style={{ fontSize: "16px" }}>{topProduct}</h2>
          <p>{topCount} sold</p>
        </div>
      </div>

      <div className="recent-bills">
        <h2>Recent Bills</h2>
        {recentBills.length === 0 ? (
          <p style={{ color: "#999", padding: "10px 0" }}>No bills yet.</p>
        ) : (
          recentBills.map((bill) => (
            <div key={bill.id} className="bill-card">
              <div className="bill-top">
                <h3>Bill #{bill.id}</h3>
                <span>{bill.date}</span>
              </div>
              {(bill.items || []).map((item, i) => (
                <div key={i} className="bill-item">
                  <span>{item.name}</span>
                  <span>x{item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <h3 className="bill-total">Total : ₹{bill.total.toLocaleString()}</h3>
            </div>
          ))
        )}
      </div>

      {/* REPORT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 Generate Sales Report</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <p className="modal-sub">Choose what period to include in the PDF report.</p>

            <div className="report-type-grid">
              {[
                { key: "date", icon: "📆", label: "Specific Date", desc: "One day's sales" },
                { key: "month", icon: "🗓️", label: "Monthly", desc: "A full month" },
                { key: "year", icon: "📅", label: "Yearly", desc: "Full year" },
                { key: "full", icon: "📋", label: "All Time", desc: `${history.length} bills total` },
              ].map(({ key, icon, label, desc }) => (
                <button
                  key={key}
                  className={`rtype-btn ${reportType === key ? "rtype-active" : ""}`}
                  onClick={() => setReportType(key)}
                >
                  <span className="rtype-icon">{icon}</span>
                  <span className="rtype-label">{label}</span>
                  <span className="rtype-desc">{desc}</span>
                </button>
              ))}
            </div>

            {reportType === "date" && (
              <div className="modal-input-group">
                <label>Select Date</label>
                <input type="date" value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)} />
              </div>
            )}
            {reportType === "month" && (
              <div className="modal-input-group">
                <label>Select Month</label>
                <input type="month" value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)} />
              </div>
            )}
            {reportType === "year" && (
              <div className="modal-input-group">
                <label>Select Year</label>
                <select value={reportYear} onChange={(e) => setReportYear(e.target.value)}>
                  <option value="">-- Select Year --</option>
                  {(years.length > 0 ? years :
                    [new Date().getFullYear(), new Date().getFullYear() - 1]
                  ).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            <button
              className={`modal-generate-btn ${!reportType ? "btn-disabled" : ""}`}
              onClick={handleGenerateReport}
              disabled={!reportType}
            >
              📥 Generate &amp; Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

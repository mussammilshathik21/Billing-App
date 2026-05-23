import "../styles/history.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// ============================================================
// HISTORY PAGE — Supabase connected
// Loads, deletes bills from 'bills' table
// ============================================================

export default function HistoryPage() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load error:", error.message);
    } else {
      const normalized = (data || []).map((row) => ({
        id: row.bill_number || row.id,
        db_id: row.id,
        date: row.date,
        items: row.items || [],
        total: row.total || 0,
      }));
      setHistory(normalized);
    }
    setLoading(false);
  };

  useEffect(() => { loadHistory(); }, []);

  // DELETE ONE BILL
  const deleteBill = async (db_id) => {
    if (!window.confirm("Delete this bill?")) return;
    const { error } = await supabase
      .from("bills")
      .delete()
      .eq("id", db_id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setHistory((prev) => prev.filter((b) => b.db_id !== db_id));
    }
  };

  // CLEAR ALL
  const clearAll = async () => {
    if (!confirm("Clear ALL bill history from database? This cannot be undone.")) return;
    const { error } = await supabase
      .from("bills")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

    if (error) {
      alert("Clear failed: " + error.message);
    } else {
      setHistory([]);
    }
  };

  return (
    <div className="container">
      <div className="history-header">
        <h2>Bill History</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={loadHistory}>🔄 Refresh</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#999", padding: "20px 0" }}>⏳ Loading from database…</p>
      ) : history.length === 0 ? (
        <p>No bills found</p>
      ) : (
        history.map((bill) => (
          <div key={bill.db_id || bill.id} className="history-card">
            <div className="history-top">
              <div>
                <p>{bill.date}</p>
                <small>Bill ID : {bill.id}</small>
              </div>
              <button onClick={() => deleteBill(bill.db_id)}>Delete</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(bill.items || []).map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.category || "Food"}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="history-summary">
              <h3>
                Total : ₹{
                  bill.total ||
                  (bill.items || []).reduce((a, b) => a + b.price * b.qty, 0)
                }
              </h3>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

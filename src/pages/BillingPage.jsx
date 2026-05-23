import { useState, useEffect } from "react";
import "../styles/billing.css";
import ProductCard from "../components/ProductCard";
import { generateInvoice } from "../utils/pdf";
import { supabase } from "../supabaseClient";

// ============================================================
// BILLING PAGE — Supabase connected
// • Loads products from Supabase
// • On "Generate Invoice":  saves bill to 'bills' table
//                           decrements stock in 'products' table
// ============================================================

export default function BillingPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  // 3-bill system
  const [bills, setBills]       = useState({ bill1: [], bill2: [], bill3: [] });
  const [activeBill, setActiveBill] = useState("bill1");
  const bill = bills[activeBill];

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch]     = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // =========================
  // LOAD PRODUCTS FROM SUPABASE
  // =========================
  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("code", { ascending: true });

    if (error) {
      console.error("Load error:", error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  // =========================
  // ADD TO BILL (check stock)
  // =========================
  const addToBill = (product) => {
    const currentStock = product.stock !== undefined ? product.stock : 999;
    const currentBill = bills[activeBill];
    const existingItem = currentBill.find((i) => i.id === product.id);
    const qtyInBill = existingItem ? existingItem.qty : 0;

    if (qtyInBill >= currentStock) {
      alert(`Only ${currentStock} in stock for "${product.name}"`);
      return;
    }

    let updatedBill;
    if (existingItem) {
      updatedBill = currentBill.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updatedBill = [...currentBill, { ...product, qty: 1 }];
    }
    setBills({ ...bills, [activeBill]: updatedBill });
    setSearch("");
  };

  const increaseQty = (id) => {
    const item = bill.find((i) => i.id === id);
    const currentStock = item?.stock !== undefined ? item.stock : 999;
    if (item && item.qty >= currentStock) {
      alert(`Only ${currentStock} in stock for "${item.name}"`);
      return;
    }
    setBills({ ...bills, [activeBill]: bill.map((i) =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    )});
  };

  const decreaseQty = (id) => {
    setBills({ ...bills, [activeBill]: bill
      .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
      .filter((i) => i.qty > 0)
    });
  };

  const removeItem = (id) => {
    setBills({ ...bills, [activeBill]: bill.filter((i) => i.id !== id) });
  };

  const cancelBill = () => {
    if (window.confirm("Cancel full bill?")) {
      setBills({ ...bills, [activeBill]: [] });
    }
  };

  const total = bill.reduce((a, b) => a + b.price * b.qty, 0);

  // =========================
  // GENERATE INVOICE
  // Saves bill to DB + deducts stock
  // =========================
  const handlePDF = async () => {
    if (!bill.length) { alert("No items in bill"); return; }

    // 1. Get next bill number
    const { data: counterData } = await supabase
      .from("bill_counter")
      .select("value")
      .eq("id", 1)
      .single();

    const billNumber = (counterData?.value || 0) + 1;

    // 2. Build bill record
    const billRecord = {
      bill_number: billNumber,
      date: new Date().toLocaleString("en-IN"),
      items: bill.map((i) => ({
        id: i.id,
        code: i.code,
        name: i.name,
        price: i.price,
        qty: i.qty,
        category: i.category,
        type: i.type,
      })),
      total,
    };

    // 3. Save bill to 'bills' table
    const { error: billError } = await supabase
      .from("bills")
      .insert([billRecord]);

    if (billError) {
      alert("Failed to save bill: " + billError.message);
      return;
    }

    // 4. Update bill counter
    await supabase
      .from("bill_counter")
      .update({ value: billNumber })
      .eq("id", 1);

    // 5. Deduct stock for each item
    for (const item of bill) {
      const product = products.find((p) => p.id === item.id);
      if (product && product.stock !== undefined) {
        const newStock = Math.max(0, product.stock - item.qty);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.id);
      }
    }

    // 6. Generate PDF invoice
    generateInvoice(bill, billNumber);

    // 7. Clear bill and refresh products (stock updated)
    setBills({ ...bills, [activeBill]: [] });
    await loadProducts();
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = products.filter((p) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      !searchText ||
      p.name.toLowerCase().includes(searchText) ||
      String(p.code || "").includes(searchText);
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const pMin = minPrice === "" ? null : Number(minPrice);
    const pMax = maxPrice === "" ? null : Number(maxPrice);
    const matchesPrice =
      (pMin === null || p.price >= pMin) &&
      (pMax === null || p.price <= pMax);
    const matchesType =
      typeFilter === "all" ||
      (p.type || "").toLowerCase() === typeFilter;
    return matchesSearch && matchesCategory && matchesPrice && matchesType;
  });

  const categories = [
    "All", "Fresh Juice", "Falooda", "Milk Shake", "Ice Cream",
    "Veg Burger", "Non Veg Burger", "Veggie Pizza", "Non Veg Pizza",
    "Veg Sandwich", "Non Veg Sandwich", "KFC - Roasted Chicken",
    "Veg Finger Bites", "Non Veg Finger Bites", "Dessert", "Salad",
    "Veg Fried Rice", "Non Veg Fried Rice", "Veg Noodles", "Non Veg Noodles",
    "Shawarma", "Extra", "Combo", "Sweets", "Mixture", "kaarum",
  ];

  return (
    <div className="billing-container">

      {/* ==================== LEFT ==================== */}
      <div className="products-section">

        <h2>Products {loading && <span style={{fontSize:"14px",color:"#999"}}>loading…</span>}</h2>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search by name or code..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <div className="price-range-group">
            <span className="filter-label">Price (₹)</span>
            <input type="number" placeholder="Min" className="price-input"
              value={minPrice} min="0" onChange={(e) => setMinPrice(e.target.value)} />
            <span className="price-sep">–</span>
            <input type="number" placeholder="Max" className="price-input"
              value={maxPrice} min="0" onChange={(e) => setMaxPrice(e.target.value)} />
            {(minPrice !== "" || maxPrice !== "") && (
              <button className="clear-price-btn"
                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                title="Clear price filter">✕</button>
            )}
          </div>

          <div className="type-toggle">
            <button className={`type-btn ${typeFilter === "all" ? "active-type" : ""}`}
              onClick={() => setTypeFilter("all")}>All</button>
            <button className={`type-btn veg-btn ${typeFilter === "veg" ? "active-type" : ""}`}
              onClick={() => setTypeFilter("veg")}>🟢 Veg</button>
            <button className={`type-btn nonveg-btn ${typeFilter === "non-veg" ? "active-type" : ""}`}
              onClick={() => setTypeFilter("non-veg")}>🔴 Non-Veg</button>
          </div>
        </div>

        <div className="category-navbar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active-category" : ""}
              onClick={() => { setSelectedCategory(cat); setSearch(""); }}
            >{cat}</button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p style={{ padding: "20px", color: "#999" }}>
              {loading ? "Loading…" : "No products found."}
            </p>
          ) : (
            filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} addToBill={addToBill} />
            ))
          )}
        </div>
      </div>

      {/* ==================== RIGHT ==================== */}
      <div className="bill-section">

        <div className="bill-switch">
          {["bill1", "bill2", "bill3"].map((b, i) => (
            <button
              key={b}
              className={activeBill === b ? "active-bill-btn" : ""}
              onClick={() => setActiveBill(b)}
            >
              Bill {i + 1}
              {bills[b].length > 0 && (
                <span className="bill-item-count">{bills[b].length}</span>
              )}
            </button>
          ))}
        </div>

        <h3>Bill Summary</h3>

        <table>
          <thead>
            <tr>
              <th>Item</th><th>Qty</th><th>Total</th><th>Del</th>
            </tr>
          </thead>
          <tbody>
            {bill.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`dot-mini ${item.type === "veg" ? "dot-veg" : "dot-nonveg"}`} />
                  #{item.code} {item.name}
                </td>
                <td>
                  <div className="qty-box">
                    <button className="qty-btn minus-btn" onClick={() => decreaseQty(item.id)}>-</button>
                    <span className="qty-number">{item.qty}</span>
                    <button className="qty-btn plus-btn" onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </td>
                <td>₹{item.price * item.qty}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Total : ₹{total}</h2>

        <div className="btn-group">
          <button className="pdf-btn" onClick={handlePDF}>Generate Invoice</button>
          <button className="cancel-btn" onClick={cancelBill}>Cancel Bill</button>
        </div>

      </div>
    </div>
  );
}

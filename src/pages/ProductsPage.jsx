import { useState, useEffect } from "react";
import "../styles/products.css";
import { supabase } from "../supabaseClient";

// ============================================================
// PRODUCTS PAGE — Supabase connected
// Add / Edit / Delete / Stock update → all go to Supabase DB
// ============================================================

const CATEGORIES = [
  "Fresh Juice", "Falooda", "Milk Shake", "Ice Cream",
  "Veg Burger", "Non Veg Burger", "Veggie Pizza", "Non Veg Pizza",
  "Veg Sandwich", "Non Veg Sandwich", "KFC - Roasted Chicken",
  "Veg Finger Bites", "Non Veg Finger Bites", "Dessert", "Salad",
  "Veg Fried Rice", "Non Veg Fried Rice", "Veg Noodles", "Non Veg Noodles",
  "Shawarma", "Extra", "Combo", "Sweets", "Mixture", "kaarum",
];

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const [search, setSearch]     = useState("");
  const [name, setName]         = useState("");
  const [price, setPrice]       = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage]       = useState("");
  const [code, setCode]         = useState("");
  const [stock, setStock]       = useState("");
  const [type, setType]         = useState("veg");
  const [editId, setEditId]     = useState(null);

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
      alert("Error loading products: " + error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  // =========================
  // CLEAR FORM
  // =========================
  const clearForm = () => {
    setCode(""); setName(""); setPrice(""); setCategory("");
    setImage(""); setStock(""); setType("veg"); setEditId(null);
  };

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================
  const addProduct = async () => {
    if (!name.trim() || !price || !category || !code || stock === "") {
      alert("Fill all fields including Stock");
      return;
    }
    setSaving(true);

    const productData = {
      code: Number(code),
      name: name.trim(),
      price: Number(price),
      category,
      image: image.trim() || null,
      stock: Number(stock),
      type,
    };

    if (editId) {
      // UPDATE existing product
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editId);

      if (error) {
        alert("Update failed: " + error.message);
      } else {
        alert("✅ Product updated!");
        await loadProducts();
        clearForm();
      }
    } else {
      // INSERT new product
      const { error } = await supabase
        .from("products")
        .insert([productData]);

      if (error) {
        alert("Add failed: " + error.message);
      } else {
        alert("✅ Product added!");
        await loadProducts();
        clearForm();
      }
    }
    setSaving(false);
  };

  // =========================
  // EDIT PRODUCT (fill form)
  // =========================
  const editProduct = (product) => {
    setEditId(product.id);
    setCode(product.code || "");
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image || "");
    setStock(product.stock !== undefined ? product.stock : "");
    setType(product.type || "veg");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // UPDATE STOCK DIRECTLY
  // =========================
  const updateStock = async (id, newStock) => {
    const val = Math.max(0, Number(newStock));
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, stock: val } : p)
    );
    const { error } = await supabase
      .from("products")
      .update({ stock: val })
      .eq("id", id);

    if (error) {
      alert("Stock update failed: " + error.message);
      await loadProducts(); // revert on error
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredProducts = products.filter((p) => {
    const searchText = search.toLowerCase().trim();
    return (
      !searchText ||
      p.name.toLowerCase().includes(searchText) ||
      String(p.code || "").includes(searchText)
    );
  });

  if (loading) return (
    <div className="container">
      <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        ⏳ Loading products from database...
      </div>
    </div>
  );

  return (
    <div className="container">

      <div className="products-header-row">
        <h2>Products Management</h2>
        <button className="reset-default-btn" onClick={loadProducts}>
          🔄 Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or code..."
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ==================== FORM ==================== */}
      <div className="form-card">
        <h3>{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>

        <div className="form">
          <input
            type="number"
            placeholder="Product Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock Qty"
            value={stock}
            min="0"
            onChange={(e) => setStock(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="veg">🟢 Veg</option>
            <option value="non-veg">🔴 Non-Veg</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={addProduct} disabled={saving}>
            {saving ? "Saving..." : (editId ? "Update Product" : "Add Product")}
          </button>
          {editId && (
            <button className="cancel-edit-btn" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ==================== PRODUCT LIST ==================== */}
      <p className="product-count">{filteredProducts.length} product(s)</p>

      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">

              {/* LEFT */}
              <div className="left">
                {product.image && (
                  <img src={product.image} alt={product.name} />
                )}
                <div>
                  <div className="product-meta">
                    <span className={`type-pill ${product.type === "veg" ? "pill-veg" : "pill-nonveg"}`}>
                      {product.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>
                    <span className="code-badge">#{product.code}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="price-text">₹{product.price} — {product.category}</p>

                  {/* Inline stock editor */}
                  <div className="stock-editor">
                    <span className="stock-label">Stock:</span>
                    <button
                      className="stock-adj-btn"
                      onClick={() => updateStock(product.id, (product.stock || 0) - 1)}
                    >−</button>
                    <input
                      type="number"
                      className="stock-inline-input"
                      value={product.stock !== undefined ? product.stock : 0}
                      min="0"
                      onChange={(e) => updateStock(product.id, e.target.value)}
                    />
                    <button
                      className="stock-adj-btn"
                      onClick={() => updateStock(product.id, (product.stock || 0) + 1)}
                    >+</button>
                    {product.stock <= 0 && (
                      <span className="out-of-stock-pill">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="btns">
                <button className="edit" onClick={() => editProduct(product)}>Edit</button>
                <button className="delete" onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

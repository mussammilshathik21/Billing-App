# 🚀 Supabase Setup Guide — Billing Pro

Follow these steps exactly to connect your app to Supabase.

---

## STEP 1 — Create a Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Click **"New Project"**
3. Give it a name like `billing-pro`
4. Choose a region close to you (Singapore is closest for India)
5. Set a database password (save it somewhere safe)
6. Wait ~2 minutes for it to initialize

---

## STEP 2 — Create Tables in Supabase

Go to your project → **Table Editor** → **SQL Editor**

Paste and run this SQL to create all required tables:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code INTEGER,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT,
  image TEXT,
  stock INTEGER DEFAULT 0,
  type TEXT DEFAULT 'veg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table (stores saved invoices)
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_number INTEGER,
  date TEXT,
  items JSONB,
  total NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill counter (auto-increment bill numbers)
CREATE TABLE bill_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  value INTEGER DEFAULT 0
);

-- Insert the single counter row
INSERT INTO bill_counter (id, value) VALUES (1, 0);
```

---

## STEP 3 — Disable Row Level Security (RLS) for Local Use

In **SQL Editor**, run:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE bill_counter DISABLE ROW LEVEL SECURITY;
```

> ⚠️ This is fine for local/personal use. If you deploy publicly, enable RLS and add policies.

---

## STEP 4 — Get Your API Keys

1. Go to your Supabase project
2. Click **Project Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

---

## STEP 5 — Paste Keys Into Your App

Open this file in the project:

```
src/supabaseClient.js
```

Replace the placeholder values:

```js
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";  // ← your URL
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";                   // ← your anon key
```

Example:
```js
const SUPABASE_URL = "https://xyzabcdef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

---

## STEP 6 — Install Dependencies & Run

Open your terminal in the project folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## STEP 7 — Import Your Existing Products (Optional)

If you had products in localStorage before, you can import them into Supabase:

1. Go to **Products** page in the app
2. Add each product using the form — it will save directly to Supabase
3. OR go to Supabase **Table Editor → products** and insert rows manually

---

## How Everything Works Now

| Feature | What happens |
|---|---|
| **Products Page — Add** | Saves new product to `products` table in Supabase |
| **Products Page — Edit** | Updates existing row in `products` table |
| **Products Page — Delete** | Deletes row from `products` table |
| **Products Page — Stock ±** | Updates `stock` column immediately in Supabase |
| **Billing Page** | Loads all products from Supabase (live stock shown) |
| **Generate Invoice** | Saves bill to `bills` table + deducts stock from `products` |
| **Dashboard** | Reads all bills from `bills` table for stats |
| **History Page** | Shows all saved bills from `bills` table |
| **Sales Report PDF** | Generates from bills data in Supabase |

---

## Stock Deduction Flow

When you click **"Generate Invoice"** on the billing page:

1. Bill is saved to the `bills` table
2. For each item in the bill, `stock` is reduced automatically
   - Example: Dairy Milk stock = 50, customer buys 2 → stock becomes 48
3. Products page refreshes to show updated stock
4. If stock hits 0, "Out of Stock" badge appears on that product

---

## Troubleshooting

**"Error loading products"** — Check your URL and anon key in `supabaseClient.js`

**Products not showing** — Make sure you ran the SQL to create tables and disabled RLS

**Bill not saving** — Check the `bills` table exists and RLS is disabled

**Stock not updating** — Make sure your product has a stock value (not null); go to Products page and set stock manually

---

## File Structure Changes Summary

```
src/
  supabaseClient.js          ← NEW: Supabase connection config
  pages/
    ProductsPage.jsx         ← Updated: Add/Edit/Delete/Stock → Supabase
    BillingPage.jsx          ← Updated: Load products + Save bills → Supabase
    DashboardPage.jsx        ← Updated: Read bills from Supabase
    HistoryPage.jsx          ← Updated: Read/Delete bills from Supabase
```

All CSS, components, and styles are **unchanged**. Only the 4 pages + 1 new file changed.


import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import BillingPage from "./pages/BillingPage";
import ProductsPage from "./pages/ProductsPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/"
          element={<BillingPage />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/history"
          element={<HistoryPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}


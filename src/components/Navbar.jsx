import "../styles/navbar.css";

import { Link } from "react-router-dom";

import { useState } from "react";

export default function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  return (

    <nav className="navbar">

      {/* LOGO */}
      <h2 className="logo">

        <span
          style={{
            color: "red",
            textShadow: "2px 2px 5px black",
          }}
        >
          JAF
        </span>{" "}

        Hot Chicken & Bakery

      </h2>

      {/* MOBILE MENU */}
      <div
        className="menu-btn"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        ☰
      </div>

      {/* LINKS */}
      <div
        className={`nav-links ${
          menuOpen ? "active" : ""
        }`}
      >

        <Link to="/">
          Billing
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/history">
          History
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

      </div>

    </nav>
  );
}


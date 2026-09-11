import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn =
    localStorage.getItem("techhub-logged-in") === "true";

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("techhub-logged-in");
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          Tech<span>HUB</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={
            menuOpen
              ? "nav-links mobile-open"
              : "nav-links"
          }
        >
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink
            to="/customer-service"
            onClick={closeMenu}
          >
            Customer Service
          </NavLink>

          <NavLink
            to="/orders"
            onClick={closeMenu}
          >
            Order History
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
          >
            About Us
          </NavLink>
        </nav>

        <div className="nav-actions">

          <Link
            to="/cart"
            className="cart-link"
            onClick={closeMenu}
          >
            🛒
            <span>Cart</span>

            {cartCount > 0 && (
              <b className="cart-count">
                {cartCount}
              </b>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <span className="welcome-user">
                Welcome, {savedUser?.name || "User"}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-btn"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="signup-btn"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;
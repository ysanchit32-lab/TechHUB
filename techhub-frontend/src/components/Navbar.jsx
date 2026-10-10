import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const token =
    localStorage.getItem("techhub-token");

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") ||
    "null"
  );

  const isLoggedIn =
    !!token && !!savedUser;

  const isEmployee =
    savedUser?.role === "EMPLOYEE";

  const isCustomer =
    isLoggedIn && !isEmployee;

  const handleLogout = () => {
    localStorage.removeItem(
      "techhub-token"
    );

    localStorage.removeItem(
      "techhub-user"
    );

    localStorage.removeItem(
      "techhub-logged-in"
    );

    setMenuOpen(false);

    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to={isEmployee ? "/dashboard" : "/"}
          className="logo"
          onClick={closeMenu}
        >
          Tech<span>HUB</span>
        </Link>


        {/* MOBILE MENU */}

        <button
          className="menu-toggle"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav
          className={
            menuOpen
              ? "nav-links mobile-open"
              : "nav-links"
          }
        >

          {/* =========================
              EMPLOYEE NAVIGATION
          ========================= */}

          {isEmployee ? (

            <>

              <NavLink
                to="/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/products"
                onClick={closeMenu}
              >
                Manage Products
              </NavLink>

              <a
                href="/dashboard#stock"
                onClick={closeMenu}
              >
                Stock Management
              </a>

              <a
                href="/dashboard#attendance"
                onClick={closeMenu}
              >
                Clock In / Out
              </a>

            </>

          ) : (

            /* =========================
               CUSTOMER NAVIGATION
            ========================= */

            <>

              <NavLink
                to="/"
                onClick={closeMenu}
              >
                Home
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

              {isCustomer && (
                <NavLink
                  to="/orders"
                  onClick={closeMenu}
                >
                  Order History
                </NavLink>
              )}

              {isCustomer && (
                <NavLink
                  to="/wishlist"
                  onClick={closeMenu}
                >
                  ♥ Wishlist
                  {wishlistCount > 0 &&
                    ` (${wishlistCount})`}
                </NavLink>
              )}

              {isCustomer && (
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                >
                  My Profile
                </NavLink>
              )}

              <NavLink
                to="/about"
                onClick={closeMenu}
              >
                About Us
              </NavLink>

            </>

          )}

        </nav>


        {/* =========================
            RIGHT SIDE ACTIONS
        ========================= */}

        <div className="nav-actions">

          {/* CART ONLY FOR CUSTOMERS */}

          {!isEmployee && (
            <Link
              to="/cart"
              className="cart-link"
              onClick={closeMenu}
            >
              🛒

              <span>
                Cart
              </span>

              {cartCount > 0 && (
                <b className="cart-count">
                  {cartCount}
                </b>
              )}

            </Link>
          )}


          {/* LOGIN / LOGOUT */}

          {isLoggedIn ? (

            <>

              <span className="welcome-user">
                {isEmployee
                  ? "Employee"
                  : `Welcome, ${
                      savedUser?.name || "User"
                    }`}
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
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Profile from "./pages/Profile";
import ManageProducts from "./pages/ManageProducts";
import NotFound from "./pages/NotFound";
import CompareBar from "./components/CompareBar";
import CustomerService from "./pages/CustomerService";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/LogIn";
import Signup from "./pages/SignUp";

function App() {
  return (
    <div className="app">

      <Navbar />

      <Routes>

        {/* =========================
            CUSTOMER HOME
        ========================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute customerOnly>
              <Home />
            </ProtectedRoute>
          }
        />


        {/* =========================
            EMPLOYEE DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute employeeOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            PRODUCTS
            Both CUSTOMER + EMPLOYEE
        ========================= */}

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/compare"
          element={<Compare />}
        />


        {/* =========================
            CUSTOMER ONLY
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute customerOnly>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute employeeOnly>
              <ManageProducts />
            </ProtectedRoute>
          }
        />


        <Route
          path="/wishlist"
          element={
            <ProtectedRoute customerOnly>
              <Wishlist />
            </ProtectedRoute>
          }
        />


        <Route
          path="/cart"
          element={
            <ProtectedRoute customerOnly>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute customerOnly>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute customerOnly>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-service"
          element={
            <ProtectedRoute customerOnly>
              <CustomerService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute customerOnly>
              <AboutUs />
            </ProtectedRoute>
          }
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* =========================
            ANY OTHER ADDRESS
        ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <CompareBar />

      <Footer />

    </div>
  );
}

export default App;
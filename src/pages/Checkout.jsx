import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    placeOrder,
    getStock,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "Cash on Delivery",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const hasStockProblem = cart.some(
    (item) =>
      getStock(item.id) <
      item.quantity
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(
        "Your cart is empty!"
      );

      navigate("/products");

      return;
    }

    if (hasStockProblem) {
      alert(
        "Some products do not have enough stock. Please return to your cart and adjust the quantities."
      );

      navigate("/cart");

      return;
    }

    setIsSubmitting(true);

    /*
      placeOrder() is responsible for:
      - checking stock
      - reducing stock
      - creating the order
      - saving the order
      - clearing the cart

      Stock is NOT reduced separately here.
    */

    const order = placeOrder(
      formData
    );

    if (!order) {
      setIsSubmitting(false);
      return;
    }

    alert(
      `Order placed successfully!\n\nOrder ID: ${order.id}`
    );

    navigate("/orders");
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (cart.length === 0) {
    return (
      <main className="page checkout-page">

        <section className="page-header">

          <span>
            CHECKOUT
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your order details.
          </p>

        </section>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="shop-btn"
          >
            Browse Products →
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="page checkout-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className="page-header">

        <span>
          TECHHUB CHECKOUT
        </span>

        <h1>
          Complete Your Order
        </h1>

        <p>
          Enter your delivery and
          payment details.
        </p>

      </section>

      {/* =========================
          STOCK WARNING
      ========================= */}

      {hasStockProblem && (

        <div className="cart-warning">

          ⚠️ Some products in your
          cart no longer have enough
          stock. Please return to the
          cart and adjust the quantity
          before placing your order.

          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Link
              to="/cart"
              style={{
                color: "#ff6b00",
                fontWeight: "700",
              }}
            >
              ← Return to Cart
            </Link>
          </div>

        </div>

      )}

      {/* =========================
          CHECKOUT CONTAINER
      ========================= */}

      <div className="checkout-container">

        {/* =========================
            CHECKOUT FORM
        ========================= */}

        <section className="checkout-form">

          <h2>
            Delivery Information
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            <div className="checkout-grid">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* CITY */}

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* STATE */}

              <div className="form-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter your state"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* PINCODE */}

              <div className="form-group">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="form-group">

              <label>
                Delivery Address
              </label>

              <textarea
                name="address"
                placeholder="Enter your complete delivery address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                rows="4"
                required
              />

            </div>

            {/* =========================
                PAYMENT
            ========================= */}

            <h2 className="payment-title">
              Payment Method
            </h2>

            <div className="payment-options">

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    formData.payment ===
                    "Cash on Delivery"
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  💵 Cash on Delivery
                </span>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    formData.payment ===
                    "UPI"
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  📱 UPI
                </span>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Credit / Debit Card"
                  checked={
                    formData.payment ===
                    "Credit / Debit Card"
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  💳 Credit / Debit Card
                </span>

              </label>

            </div>

            {/* =========================
                PLACE ORDER
            ========================= */}

            <button
              type="submit"
              className="checkout-btn"
              disabled={
                isSubmitting ||
                hasStockProblem
              }
            >

              {isSubmitting
                ? "Placing Order..."
                : hasStockProblem
                ? "Fix Stock Before Checkout"
                : `Place Order • ₹${cartTotal.toLocaleString()}`}

            </button>

          </form>

        </section>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="checkout-summary">

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            {/* PRODUCTS */}

            <div className="summary-row">

              <span>
                Products
              </span>

              <span>
                {cart.length}
              </span>

            </div>

            {/* ITEMS */}

            <div className="summary-row">

              <span>
                Total Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>

            {/* CART PRODUCTS */}

            <div
              className="checkout-products"
              style={{
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >

              {cart.map(
                (item) => (

                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <p>
                        Qty:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </strong>

                  </div>

                )
              )}

            </div>

            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {cartTotal.toLocaleString()}
              </span>

            </div>

            {/* DELIVERY */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                FREE
              </span>

            </div>

            <hr />

            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {cartTotal.toLocaleString()}
              </strong>

            </div>

            {/* BACK TO CART */}

            <Link
              to="/cart"
              className="continue-shopping"
            >
              ← Edit Cart
            </Link>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;
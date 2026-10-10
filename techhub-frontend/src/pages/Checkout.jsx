import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

// DEMO PAYMENT
// No real payment happens here. Card / UPI details stay in this page
// and are never sent to the server. Only the payment method is sent.

const TEST_CARD_DECLINED = "4000000000000002";

// Delivery details saved on the Profile page
const loadProfile = (email) => {
  try {
    return JSON.parse(
      localStorage.getItem(`techhub-profile-${email}`) || "{}"
    );
  } catch {
    return {};
  }
};

function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    placeOrder,
    getStock,
  } = useCart();

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const profile = loadProfile(savedUser?.email);

  const [formData, setFormData] = useState({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pincode || "",
    payment: "Cash on Delivery",
  });

  // Coupon code
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Demo payment details (kept only in this page)
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [paymentError, setPaymentError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState("");

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const discount = appliedCoupon ? appliedCoupon.discount : 0;

  const finalTotal = Math.max(0, cartTotal - discount);

  const hasStockProblem = cart.some(
    (item) => getStock(item.id) < item.quantity
  );

  const isOnlinePayment =
    formData.payment === "UPI" ||
    formData.payment === "Credit / Debit Card";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setPaymentError("");
  };

  // 4111111111111111 -> "4111 1111 1111 1111"
  const handleCardNumber = (e) => {
    const digits = e.target.value
      .replace(/\D/g, "")
      .slice(0, 16);

    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
    setPaymentError("");
  };

  // 1230 -> "12/30"
  const handleExpiry = (e) => {
    let digits = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (digits.length > 2) {
      digits = digits.slice(0, 2) + "/" + digits.slice(2);
    }

    setCardExpiry(digits);
    setPaymentError("");
  };

  // Returns an error message, or "" when the demo details look valid
  const validatePayment = () => {

    if (formData.payment === "UPI") {

      if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        return "Enter a valid UPI ID, for example demo@upi";
      }

      return "";
    }

    if (formData.payment === "Credit / Debit Card") {

      const digits = cardNumber.replace(/\s/g, "");

      if (digits.length !== 16) {
        return "Card number must have 16 digits.";
      }

      if (!cardName.trim()) {
        return "Enter the name on the card.";
      }

      const match = cardExpiry.match(/^(\d{2})\/(\d{2})$/);

      if (!match) {
        return "Enter the expiry date as MM/YY.";
      }

      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      const now = new Date();

      const expired =
        year < now.getFullYear() ||
        (year === now.getFullYear() &&
          month < now.getMonth() + 1);

      if (month < 1 || month > 12 || expired) {
        return "This card has expired or the date is invalid.";
      }

      if (!/^\d{3}$/.test(cardCvv)) {
        return "CVV must have 3 digits.";
      }

      if (digits === TEST_CARD_DECLINED) {
        return "Payment declined by the bank (demo test card).";
      }
    }

    return "";
  };

  const handleApplyCoupon = async () => {

    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponMessage("Enter a coupon code first.");
      return;
    }

    const token = localStorage.getItem("techhub-token");

    setCheckingCoupon(true);
    setCouponMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/coupon?code=${encodeURIComponent(
          code
        )}&subtotal=${cartTotal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon({ code, discount: data.discount });
        setCouponMessage(
          `Coupon ${code} applied. You save ₹${Number(
            data.discount
          ).toLocaleString("en-IN")}.`
        );
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.message || "Invalid coupon code.");
      }

    } catch (error) {
      console.error(error);
      setCouponMessage("Could not check the coupon. Is the backend running?");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      navigate("/products");
      return;
    }

    if (hasStockProblem) {
      alert("Some products do not have enough stock.");
      navigate("/cart");
      return;
    }

    const problem = validatePayment();

    if (problem) {
      setPaymentError(problem);
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    // Fake payment processing
    if (isOnlinePayment) {

      setStage("Processing payment...");

      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );
    }

    setStage("Placing order...");

    const order = await placeOrder({
      ...formData,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
    });

    if (!order) {
      setIsSubmitting(false);
      setStage("");
      return;
    }

    alert(
      `Order placed successfully!\n\nOrder ID: ${order.id}` +
        (isOnlinePayment
          ? "\nDemo payment successful (no real money was charged)."
          : "\nPay when your order is delivered.")
    );

    navigate("/orders");

    setIsSubmitting(false);
    setStage("");
  };

  if (cart.length === 0) {

    return (
      <main className="page checkout-page">

        <section className="page-header">

          <span>CHECKOUT</span>

          <h1>Checkout</h1>

          <p>Complete your order details.</p>

        </section>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <Link to="/products" className="shop-btn">
            Browse Products →
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="page checkout-page">

      <section className="page-header">

        <span>TECHHUB CHECKOUT</span>

        <h1>Complete Your Order</h1>

        <p>
          Enter your delivery and
          payment details.
        </p>

      </section>

      {hasStockProblem && (

        <div className="cart-warning">

          ⚠️ Some products in your cart
          no longer have enough stock.

          <div style={{ marginTop: "10px" }}>

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

      <div className="checkout-container">

        <section className="checkout-form">

          <h2>Delivery Information</h2>

          <form onSubmit={handleSubmit}>

            <div className="checkout-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />
              </div>

            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                name="address"
                placeholder="Enter your complete delivery address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <h2 className="payment-title">
              Payment Method
            </h2>

            <div className="payment-options">

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={formData.payment === "Cash on Delivery"}
                  onChange={handleChange}
                />
                <span>💵 Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={formData.payment === "UPI"}
                  onChange={handleChange}
                />
                <span>📱 UPI</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="Credit / Debit Card"
                  checked={formData.payment === "Credit / Debit Card"}
                  onChange={handleChange}
                />
                <span>💳 Credit / Debit Card</span>
              </label>

            </div>

            {isOnlinePayment && (
              <div className="demo-payment-note">
                🧪 <strong>Demo mode:</strong> no real
                payment is made and nothing is charged.
                {formData.payment === "UPI" ? (
                  <> Use any UPI ID such as <strong>demo@upi</strong>.</>
                ) : (
                  <>
                    {" "}Test card: <strong>4111 1111 1111 1111</strong>,
                    any future expiry, any 3-digit CVV. Use{" "}
                    <strong>4000 0000 0000 0002</strong> to see a
                    declined payment.
                  </>
                )}
              </div>
            )}

            {formData.payment === "UPI" && (
              <div className="demo-payment-box">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="name@bank"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setPaymentError("");
                    }}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            {formData.payment === "Credit / Debit Card" && (
              <div className="demo-payment-box">

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumber}
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setPaymentError("");
                    }}
                    autoComplete="off"
                  />
                </div>

                <div className="demo-payment-row">

                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiry}
                      autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      maxLength="3"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(
                          e.target.value.replace(/\D/g, "").slice(0, 3)
                        );
                        setPaymentError("");
                      }}
                      autoComplete="off"
                    />
                  </div>

                </div>

              </div>
            )}

            {paymentError && (
              <div className="demo-payment-error">
                ✕ {paymentError}
              </div>
            )}

            <button
              type="submit"
              className="checkout-btn"
              disabled={isSubmitting || hasStockProblem}
            >
              {isSubmitting
                ? stage || "Please wait..."
                : isOnlinePayment
                ? `Pay ₹${finalTotal.toLocaleString("en-IN")} →`
                : "Place Order →"}
            </button>

          </form>

        </section>

        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          {cart.map((item) => (

            <div className="checkout-product" key={item.id}>

              <div>
                <strong>{item.name}</strong>
                <span>Qty: {item.quantity}</span>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>

            </div>

          ))}

          <div className="coupon-box">

            <label htmlFor="coupon">Have a coupon?</label>

            {appliedCoupon ? (
              <div className="coupon-applied">
                <span>🏷️ {appliedCoupon.code}</span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="coupon-row">
                <input
                  id="coupon"
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={checkingCoupon}
                >
                  {checkingCoupon ? "..." : "Apply"}
                </button>
              </div>
            )}

            {couponMessage && (
              <small
                className={
                  appliedCoupon ? "coupon-ok" : "coupon-bad"
                }
              >
                {couponMessage}
              </small>
            )}

            {!appliedCoupon && (
              <small className="coupon-hint">
                Try TECH10 (10% off), FESTIVE5 (5% off) or
                WELCOME500 (₹500 off orders above ₹10,000).
              </small>
            )}

          </div>

          <div className="summary-row">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>FREE</span>
          </div>

          <div className="summary-row">
            <span>Payment</span>
            <span>{formData.payment}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row">
              <span>Discount</span>
              <span>
                − ₹{discount.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="summary-total">
            <span>Total</span>
            <strong>
              ₹{finalTotal.toLocaleString("en-IN")}
            </strong>
          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;

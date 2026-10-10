import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";
import { useInventory } from "../context/InventoryContext";

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

// Shows how far the order has progressed
function OrderTimeline({ status }) {

  if (status === "CANCELLED") {
    return (
      <div className="order-timeline cancelled">
        ✕ This order was cancelled
      </div>
    );
  }

  const current = TIMELINE_STEPS.findIndex(
    (step) => step.key === status
  );

  return (
    <ol
      className="order-timeline"
      aria-label="Order progress"
    >
      {TIMELINE_STEPS.map((step, index) => (
        <li
          key={step.key}
          className={
            index < current
              ? "done"
              : index === current
              ? "current"
              : ""
          }
        >
          <span className="dot">
            {index < current ? "✓" : index + 1}
          </span>

          <span className="label">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}

function OrderHistory() {

  const { refreshInventory } = useInventory();

  const [cancellingId, setCancellingId] =
    useState(null);

  // Customer cancels their own order (only while it is PENDING)
  const handleCancel = async (orderId) => {

    const confirmed = window.confirm(
      "Cancel this order?\n\nThe items go back in stock and any online payment is refunded (demo)."
    );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("techhub-token");

    setCancellingId(orderId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Could not cancel the order."
        );
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? data : order
        )
      );

      refreshInventory();

    } catch (err) {
      console.error(err);
      alert(
        "Could not connect to the TechHUB backend."
      );
    } finally {
      setCancellingId(null);
    }
  };


  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const fetchOrders = async () => {

      const token =
        localStorage.getItem(
          "techhub-token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const response =
          await fetch(
            "http://localhost:8080/api/orders/my-orders",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          setError(
            data.error ||
            "Failed to load orders."
          );

          return;
        }

        setOrders(data);

      } catch (err) {

        console.error(err);

        setError(
          "Could not connect to the TechHUB backend."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  const getStatusClass = (
    status
  ) => {

    return (
      `order-status ${status
        ?.toLowerCase()
        .replace(/\s+/g, "-")}`
    );
  };

  if (loading) {

    return (
      <main className="page">

        <section className="page-header">

          <span>
            ORDER HISTORY
          </span>

          <h1>
            Your Orders
          </h1>

          <p>
            Loading your orders...
          </p>

        </section>

      </main>
    );
  }

  return (
    <main className="page order-page">

      <section className="page-header">

        <span>
          ORDER HISTORY
        </span>

        <h1>
          Your Orders
        </h1>

        <p>
          Track and view your TechHUB orders.
        </p>

      </section>

      {error && (

        <div className="cart-warning">
          ⚠️ {error}
        </div>

      )}

      {!error &&
        orders.length === 0 && (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              📦
            </div>

            <h1>
              No Orders Yet
            </h1>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="shop-btn"
            >
              Start Shopping →
            </Link>

          </div>
        )}

      {orders.length > 0 && (

        <section className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-header">

                <div>

                  <span>
                    ORDER ID
                  </span>

                  <h2>
                    TH-{order.id}
                  </h2>

                </div>

                <span
                  className={getStatusClass(
                    order.status
                  )}
                >
                  {order.status}
                </span>

              </div>

              {order.paymentMethod && (
                <p className="order-payment">
                  💳 {order.paymentMethod}
                  {order.paymentStatus
                    ? ` · ${order.paymentStatus}`
                    : ""}
                </p>
              )}

              {order.couponCode && (
                <p className="order-payment">
                  🏷️ Coupon {order.couponCode}
                  {order.discountAmount > 0
                    ? ` · saved ₹${Number(
                        order.discountAmount
                      ).toLocaleString("en-IN")}`
                    : ""}
                </p>
              )}

              <OrderTimeline status={order.status} />

              {order.status === "PENDING" && (
                <button
                  type="button"
                  className="cancel-order-btn"
                  disabled={cancellingId === order.id}
                  onClick={() =>
                    handleCancel(order.id)
                  }
                >
                  {cancellingId === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}

              <div className="order-details">

                <div className="order-product-icon">
                  📦
                </div>

                <div className="order-product-info">

                  <span>
                    {order.items?.length === 1
                      ? order.items[0]
                          ?.productName
                      : `${order.items?.length || 0} Products`}
                  </span>

                  <h3>

                    {order.items
                      ?.map(
                        (item) =>
                          `${item.productName} × ${item.quantity}`
                      )
                      .join(", ")}

                  </h3>

                </div>

                <div className="order-price">

                  <span>
                    AMOUNT
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>

              <div className="order-customer">

                <div>

                  <span>
                    ORDER DATE
                  </span>

                  <strong>
                    {new Date(
                      order.orderDate
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    ITEMS
                  </span>

                  <strong>
                    {order.items?.reduce(
                      (total, item) =>
                        total +
                        item.quantity,
                      0
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    DELIVERY
                  </span>

                  <strong>
                    {order.shippingAddress}
                  </strong>

                </div>

              </div>

              <div className="order-actions">

                <button
                  onClick={() =>
                    alert(
                      `Order #${order.id}\n\n` +
                      `Status: ${order.status}\n` +
                      `Total: ₹${Number(
                        order.totalAmount || 0
                      ).toLocaleString()}\n\n` +
                      `Delivery Address:\n${order.shippingAddress}`
                    )
                  }
                >
                  View Details
                </button>

              </div>

            </div>

          ))}

        </section>

      )}

      <section className="order-bottom">

        <p>
          Looking for more products?
        </p>

        <Link to="/products">
          Continue Shopping →
        </Link>

      </section>

    </main>
  );
}

export default OrderHistory;
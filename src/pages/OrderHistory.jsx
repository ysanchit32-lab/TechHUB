import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function OrderHistory() {
  const {
    orders,
  } = useCart();

  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <main className="page order-history-page">

      <section className="page-header">

        <span>YOUR ORDERS</span>

        <h1>Order History</h1>

        <p>
          View and track all your previous
          TechHUB orders.
        </p>

      </section>

      <section className="orders-container">

        {orders.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              📦
            </div>

            <h1>No Orders Yet</h1>

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

        ) : (

          orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-top">

                <div>
                  <span className="order-label">
                    ORDER ID
                  </span>

                  <h3>
                    #{order.id}
                  </h3>
                </div>

                <div>
                  <span className="order-label">
                    ORDER DATE
                  </span>

                  <p>
                    {order.date}
                  </p>
                </div>

                <span
                  className={`order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="order-details">

                <div className="order-product-icon">
                  📦
                </div>

                <div className="order-product-info">

                  <span>
                    {order.items.length === 1
                      ? order.items[0].category
                      : `${order.items.length} Products`}
                  </span>

                  <h3>
                    {order.items.length === 1
                      ? order.items[0].name
                      : order.items
                          .map(
                            (item) =>
                              `${item.name} × ${item.quantity}`
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
                    {order.total.toLocaleString()}
                  </strong>

                </div>

              </div>

              <div className="order-customer">

                <div>
                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {order.customer?.name ||
                      "Customer"}
                  </strong>
                </div>

                <div>
                  <span>
                    PAYMENT
                  </span>

                  <strong>
                    {order.customer?.payment ||
                      "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>
                    ITEMS
                  </span>

                  <strong>
                    {order.items.reduce(
                      (total, item) =>
                        total +
                        item.quantity,
                      0
                    )}
                  </strong>
                </div>

              </div>

              <div className="order-actions">

                <button
                  onClick={() =>
                    alert(
                      `Order #${order.id}\n\n` +
                      `Customer: ${
                        order.customer?.name ||
                        "Customer"
                      }\n` +
                      `Email: ${
                        order.customer?.email ||
                        "N/A"
                      }\n` +
                      `Phone: ${
                        order.customer?.phone ||
                        "N/A"
                      }\n` +
                      `Payment: ${
                        order.customer?.payment ||
                        "N/A"
                      }\n` +
                      `Status: ${
                        order.status
                      }\n` +
                      `Total: ₹${order.total.toLocaleString()}`
                    )
                  }
                >
                  View Details
                </button>

              </div>

            </div>

          ))

        )}

      </section>

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
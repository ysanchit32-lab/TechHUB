import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";

function Dashboard() {
  const {
    cart,
    cartTotal,
    orders,
    updateOrderStatus,
  } = useCart();

  const {
    inventory,
    increaseStock,
    decreaseStock,
    resetInventory,
  } = useInventory();

  const totalStock = inventory.reduce(
    (total, product) =>
      total + product.stock,
    0
  );

  const lowStockProducts =
    inventory.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5
    );

  const outOfStockProducts =
    inventory.filter(
      (product) =>
        product.stock === 0
    );

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const getStockClass = (stock) => {
    if (stock === 0) {
      return "out-stock";
    }

    if (stock <= 5) {
      return "low-stock";
    }

    return "in-stock";
  };

  const handleStatusUpdate = (order) => {
    if (order.status === "Processing") {
      updateOrderStatus(
        order.id,
        "Shipped"
      );
    } else if (
      order.status === "Shipped"
    ) {
      updateOrderStatus(
        order.id,
        "Delivered"
      );
    }
  };

  return (
    <main className="page dashboard-page">

      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <section className="dashboard-welcome">

        <div>
          <span>
            TECHHUB MANAGEMENT
          </span>

          <h1>
            Inventory Dashboard
          </h1>

          <p>
            Monitor products, stock,
            orders and store activity.
          </p>
        </div>

        <Link
          to="/products"
          className="dashboard-shop-btn"
        >
          View Products →
        </Link>

      </section>

      {/* =========================
          DASHBOARD STATS
      ========================= */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {inventory.length}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📊
          </div>

          <div>
            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🛒
          </div>

          <div>
            <span>
              Cart Items
            </span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total +
                  item.quantity,
                0
              )}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🧾
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>

      </section>

      {/* =========================
          INVENTORY MANAGEMENT
      ========================= */}

      <section className="inventory-panel">

        <div className="inventory-header">

          <div>
            <span>
              STOCK CONTROL
            </span>

            <h2>
              Inventory Management
            </h2>
          </div>

          <button
            type="button"
            className="reset-stock-btn"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all stock to the original values?"
                )
              ) {
                resetInventory();
              }
            }}
          >
            Reset Stock
          </button>

        </div>

        {/* INVENTORY SUMMARY */}

        <div className="inventory-summary">

          <div className="inventory-summary-card">

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

          </div>

          <div className="inventory-summary-card">

            <span>
              Products
            </span>

            <strong>
              {inventory.length}
            </strong>

          </div>

          <div className="inventory-summary-card warning">

            <span>
              Low Stock
            </span>

            <strong>
              {lowStockProducts.length}
            </strong>

          </div>

          <div className="inventory-summary-card danger">

            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStockProducts.length}
            </strong>

          </div>

        </div>

        {/* INVENTORY TABLE */}

        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>
                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Manage
                </th>
              </tr>

            </thead>

            <tbody>

              {inventory.map(
                (product) => (

                  <tr
                    key={product.id}
                  >

                    <td>

                      <div className="inventory-product">

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                        />

                        <strong>
                          {
                            product.name
                          }
                        </strong>

                      </div>

                    </td>

                    <td>
                      {
                        product.category
                      }
                    </td>

                    <td>
                      ₹
                      {product.price.toLocaleString()}
                    </td>

                    <td>

                      <div className="stock-controls">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseStock(
                              product.id
                            )
                          }
                          disabled={
                            product.stock ===
                            0
                          }
                        >
                          −
                        </button>

                        <span>
                          {
                            product.stock
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseStock(
                              product.id
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </td>

                    <td>

                      <span
                        className={`inventory-status ${getStockClass(
                          product.stock
                        )}`}
                      >
                        {
                          getStockStatus(
                            product.stock
                          )
                        }
                      </span>

                    </td>

                    <td>

                      <Link
                        to={`/products/${product.id}`}
                        className="inventory-view-btn"
                      >
                        View
                      </Link>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================
          ORDER MANAGEMENT
      ========================= */}

      <section className="dashboard-panel orders-management-panel">

        <div className="panel-header">

          <div>
            <span>
              ORDER MANAGEMENT
            </span>

            <h2>
              Recent Orders
            </h2>
          </div>

          <Link to="/orders">
            View All →
          </Link>

        </div>

        {orders.length === 0 ? (

          <div className="dashboard-empty">

            <div>
              📦
            </div>

            <h3>
              No Orders Yet
            </h3>

            <p>
              Orders will appear here
              after customers make purchases.
            </p>

            <Link to="/products">
              Browse Products →
            </Link>

          </div>

        ) : (

          <div className="orders-management-list">

            {orders
              .slice(0, 5)
              .map((order) => {

                const itemCount =
                  order.items.reduce(
                    (total, item) =>
                      total +
                      item.quantity,
                    0
                  );

                return (
                  <div
                    className="management-order"
                    key={order.id}
                  >

                    {/* ORDER INFORMATION */}

                    <div className="management-order-info">

                      <strong>
                        #{order.id}
                      </strong>

                      <span>
                        {
                          order.customer
                            ?.name ||
                          "Customer"
                        }
                      </span>

                      <small>
                        {order.date}
                      </small>

                    </div>

                    {/* ITEM COUNT */}

                    <div className="management-order-items">

                      {itemCount}{" "}
                      item
                      {itemCount !== 1
                        ? "s"
                        : ""}

                    </div>

                    {/* ORDER TOTAL */}

                    <strong className="management-order-total">

                      ₹
                      {order.total.toLocaleString()}

                    </strong>

                    {/* ORDER STATUS */}

                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {
                        order.status
                      }
                    </span>

                    {/* STATUS BUTTON */}

                    {order.status !==
                      "Delivered" && (

                      <button
                        type="button"
                        className="status-update-btn"
                        onClick={() =>
                          handleStatusUpdate(
                            order
                          )
                        }
                      >

                        {order.status ===
                        "Processing"
                          ? "Mark Shipped"
                          : "Mark Delivered"}

                      </button>

                    )}

                  </div>
                );
              })}

          </div>

        )}

      </section>

      {/* =========================
          CART + STOCK ALERTS
      ========================= */}

      <div className="dashboard-grid">

        {/* CURRENT CART */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span>
                CURRENT CART
              </span>

              <h2>
                Shopping Cart
              </h2>

            </div>

            <Link to="/cart">
              Open Cart →
            </Link>

          </div>

          {cart.length === 0 ? (

            <div className="dashboard-empty">

              <div>
                🛒
              </div>

              <h3>
                Cart is Empty
              </h3>

              <p>
                Add products to see
                them here.
              </p>

              <Link to="/products">
                Shop Now →
              </Link>

            </div>

          ) : (

            <>

              {cart.map((item) => (

                <div
                  className="dashboard-cart-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h3>
                      {item.name}
                    </h3>

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

              ))}

              <div className="dashboard-cart-total">

                <span>
                  Cart Total
                </span>

                <strong>
                  ₹
                  {cartTotal.toLocaleString()}
                </strong>

              </div>

            </>

          )}

        </section>

        {/* STOCK ALERTS */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span>
                STORE OVERVIEW
              </span>

              <h2>
                Stock Alerts
              </h2>

            </div>

          </div>

          {outOfStockProducts.length >
            0 && (

            <div className="alert-box danger-alert">

              <strong>
                ⚠️ Out of Stock
              </strong>

              <p>
                {outOfStockProducts
                  .map(
                    (product) =>
                      product.name
                  )
                  .join(", ")}
              </p>

            </div>

          )}

          {lowStockProducts.length >
            0 && (

            <div className="alert-box warning-alert">

              <strong>
                ⚠️ Low Stock
              </strong>

              <p>
                {
                  lowStockProducts.length
                }{" "}
                product
                {lowStockProducts.length !==
                1
                  ? "s"
                  : ""}{" "}
                need attention.
              </p>

            </div>

          )}

          {lowStockProducts.length ===
            0 &&
            outOfStockProducts.length ===
              0 && (

            <div className="dashboard-empty">

              <div>
                ✓
              </div>

              <h3>
                Stock Looks Good
              </h3>

              <p>
                All products have
                sufficient stock.
              </p>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default Dashboard;

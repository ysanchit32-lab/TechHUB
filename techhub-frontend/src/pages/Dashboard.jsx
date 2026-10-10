import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";

function Dashboard() {
  const {
    cart,
    cartTotal,
    orders,
    fetchOrders,
    updateOrderStatus,
  } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  const {
    inventory,
    increaseStock,
    decreaseStock,
    refreshInventory,
  } = useInventory();

  /* =====================================================
     SAFE DATA
  ===================================================== */

  const safeInventory = Array.isArray(inventory)
    ? inventory
    : [];

  // Products that need restocking (5 or fewer left)
  const restockProducts = safeInventory
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  const safeCart = Array.isArray(cart)
    ? cart
    : [];

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];

  // false = show the 5 latest orders, true = show every order
  const [showAllOrders, setShowAllOrders] =
    useState(false);

  const visibleOrders = showAllOrders
    ? safeOrders
    : safeOrders.slice(0, 5);


  /* =====================================================
     INVENTORY CALCULATIONS
  ===================================================== */

  const totalStock = safeInventory.reduce(
    (total, product) =>
      total + (Number(product.stock) || 0),
    0
  );

  const lowStockProducts =
    safeInventory.filter(
      (product) =>
        Number(product.stock) > 0 &&
        Number(product.stock) <= 5
    );

  const outOfStockProducts =
    safeInventory.filter(
      (product) =>
        Number(product.stock) === 0
    );


  /* =====================================================
     STOCK STATUS
  ===================================================== */

  const getStockStatus = (stock) => {
    if (Number(stock) === 0) {
      return "Out of Stock";
    }

    if (Number(stock) <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  };


  const getStockClass = (stock) => {
    if (Number(stock) === 0) {
      return "out-stock";
    }

    if (Number(stock) <= 5) {
      return "low-stock";
    }

    return "in-stock";
  };


  /* =====================================================
     ORDER STATUS
  ===================================================== */

  const getNextStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "CONFIRMED";

      case "CONFIRMED":
        return "SHIPPED";

      case "SHIPPED":
        return "DELIVERED";

      default:
        return null;
    }
  };


  const getStatusButtonText = (status) => {
    switch (status) {
      case "PENDING":
        return "Confirm Order";

      case "CONFIRMED":
        return "Mark Shipped";

      case "SHIPPED":
        return "Mark Delivered";

      default:
        return "";
    }
  };


  const handleStatusUpdate = async (order) => {
    const nextStatus =
      getNextStatus(order.status);

    if (!nextStatus) {
      return;
    }

    await updateOrderStatus(
      order.id,
      nextStatus
    );
  };


  // Employee cancels an order (stock goes back automatically)
  const handleCancelOrder = async (order) => {

    const confirmed = window.confirm(
      `Cancel order #${order.id}?\n\nThe items will be returned to stock.`
    );

    if (!confirmed) {
      return;
    }

    const done = await updateOrderStatus(
      order.id,
      "CANCELLED"
    );

    if (done) {
      refreshInventory();
    }
  };


  /* =====================================================
     EMPLOYEE ATTENDANCE
  ===================================================== */

  const ATTENDANCE_KEY =
    "techhub-employee-attendance";


  const getTodayKey = () => {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const formatTime = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
  };


  const calculateHours = (
    clockIn,
    clockOut
  ) => {
    if (!clockIn || !clockOut) {
      return 0;
    }

    const difference =
      new Date(clockOut).getTime() -
      new Date(clockIn).getTime();

    return difference / 1000 / 60 / 60;
  };


  const formatHours = (hours) => {
    if (!hours || hours < 0) {
      return "0h 0m";
    }

    const wholeHours =
      Math.floor(hours);

    const minutes =
      Math.floor(
        (hours - wholeHours) * 60
      );

    return `${wholeHours}h ${minutes}m`;
  };


  const [attendance, setAttendance] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            ATTENDANCE_KEY
          );

        if (!saved) {
          return [];
        }

        const parsed =
          JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    });


  const [currentTime, setCurrentTime] =
    useState(new Date());


  /* =====================================================
     LIVE CLOCK
  ===================================================== */

  useEffect(() => {
    const timer =
      setInterval(() => {
        setCurrentTime(
          new Date()
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);


  /* =====================================================
     SAVE ATTENDANCE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      ATTENDANCE_KEY,
      JSON.stringify(attendance)
    );
  }, [attendance]);


  /* =====================================================
     TODAY ATTENDANCE
  ===================================================== */

  const todayKey =
    getTodayKey();


  const todayRecord =
    attendance.find(
      (record) =>
        record.date === todayKey
    );


  const isClockedIn =
    !!todayRecord?.clockIn &&
    !todayRecord?.clockOut;


  const completedHoursToday =
    todayRecord?.clockOut
      ? calculateHours(
          todayRecord.clockIn,
          todayRecord.clockOut
        )
      : isClockedIn
      ? calculateHours(
          todayRecord.clockIn,
          currentTime
        )
      : 0;


  const totalHoursWorked =
    attendance.reduce(
      (total, record) =>
        total +
        calculateHours(
          record.clockIn,
          record.clockOut
        ),
      0
    );


  /* =====================================================
     CLOCK IN
  ===================================================== */

  const handleClockIn = () => {
    if (todayRecord) {
      alert(
        "You have already clocked in today."
      );

      return;
    }

    const newRecord = {
      date: todayKey,
      clockIn:
        new Date().toISOString(),
      clockOut: null,
    };

    setAttendance((previous) => [
      ...previous,
      newRecord,
    ]);
  };


  /* =====================================================
     CLOCK OUT
  ===================================================== */

  const handleClockOut = () => {
    if (!todayRecord) {
      alert(
        "Please clock in first."
      );

      return;
    }

    if (todayRecord.clockOut) {
      alert(
        "You have already clocked out today."
      );

      return;
    }

    const clockOut =
      new Date().toISOString();

    setAttendance((previous) =>
      previous.map((record) =>
        record.date === todayKey
          ? {
              ...record,
              clockOut,
            }
          : record
      )
    );
  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="page dashboard-page">

      {/* =================================================
          DASHBOARD HEADER
      ================================================= */}

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


      {/* =================================================
          DASHBOARD STATS
      ================================================= */}

      <section className="dashboard-stats">

        {/* TOTAL PRODUCTS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {safeInventory.length}
            </strong>

          </div>

        </div>


        {/* TOTAL STOCK */}

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


        {/* CART ITEMS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🛒
          </div>

          <div>

            <span>
              Cart Items
            </span>

            <strong>
              {safeCart.reduce(
                (total, item) =>
                  total +
                  (Number(item.quantity) || 0),
                0
              )}
            </strong>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🧾
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {safeOrders.length}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          EMPLOYEE ATTENDANCE
      ================================================= */}

      <section
        className="employee-attendance"
        id="attendance"
      >

        <div className="attendance-header">

          <div>

            <span>
              EMPLOYEE ATTENDANCE
            </span>

            <h2>
              Clock In / Clock Out
            </h2>

            <p>
              Record and monitor your
              working hours.
            </p>

          </div>


          <div className="attendance-live-clock">
            {formatTime(currentTime)}
          </div>

        </div>


        {/* ATTENDANCE CARDS */}

        <div className="attendance-cards">

          {/* DATE */}

          <div className="attendance-card">

            <span>
              Today's Date
            </span>

            <strong>
              {todayKey}
            </strong>

          </div>


          {/* CLOCK IN */}

          <div className="attendance-card">

            <span>
              Clock In
            </span>

            <strong>
              {todayRecord?.clockIn
                ? formatTime(
                    todayRecord.clockIn
                  )
                : "--"}
            </strong>

          </div>


          {/* CLOCK OUT */}

          <div className="attendance-card">

            <span>
              Clock Out
            </span>

            <strong>
              {todayRecord?.clockOut
                ? formatTime(
                    todayRecord.clockOut
                  )
                : "--"}
            </strong>

          </div>


          {/* TODAY HOURS */}

          <div className="attendance-card">

            <span>
              Today's Hours
            </span>

            <strong>
              {formatHours(
                completedHoursToday
              )}
            </strong>

          </div>


          {/* TOTAL HOURS */}

          <div className="attendance-card">

            <span>
              Total Completed Hours
            </span>

            <strong>
              {formatHours(
                totalHoursWorked
              )}
            </strong>

          </div>

        </div>


        {/* CLOCK BUTTONS */}

        <div className="attendance-actions">

          <button
            type="button"
            className="clock-in-btn"
            onClick={handleClockIn}
            disabled={!!todayRecord}
          >
            ✓ Clock In
          </button>


          <button
            type="button"
            className="clock-out-btn"
            onClick={handleClockOut}
            disabled={!isClockedIn}
          >
            ⏱ Clock Out
          </button>


          <span
            className={
              isClockedIn
                ? "attendance-status working"
                : "attendance-status"
            }
          >

            {isClockedIn
              ? "● Currently Working"
              : todayRecord?.clockOut
              ? "✓ Shift Completed"
              : "○ Not Clocked In"}

          </span>

        </div>


        {/* =================================================
            WORK HISTORY
        ================================================= */}

        <div className="attendance-history">

          <div className="attendance-history-header">

            <div>

              <span>
                WORK HISTORY
              </span>

              <h3>
                Previous Attendance
              </h3>

            </div>

          </div>


          {attendance.length === 0 ? (

            <div className="attendance-empty">

              <span>
                🕐
              </span>

              <p>
                No attendance records yet.
              </p>

            </div>

          ) : (

            <div className="attendance-history-table">

              <div className="attendance-history-row attendance-history-heading">

                <strong>
                  Date
                </strong>

                <strong>
                  Clock In
                </strong>

                <strong>
                  Clock Out
                </strong>

                <strong>
                  Hours Worked
                </strong>

              </div>


              {[
                ...attendance,
              ]
                .reverse()
                .slice(0, 10)
                .map((record) => (

                  <div
                    className="attendance-history-row"
                    key={record.date}
                  >

                    <span>
                      {record.date}
                    </span>

                    <span>
                      {formatTime(
                        record.clockIn
                      )}
                    </span>

                    <span>
                      {record.clockOut
                        ? formatTime(
                            record.clockOut
                          )
                        : "Still Working"}
                    </span>

                    <span>
                      {record.clockOut
                        ? formatHours(
                            calculateHours(
                              record.clockIn,
                              record.clockOut
                            )
                          )
                        : "In Progress"}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </div>

      </section>


      {/* LOW STOCK ALERT */}

      {restockProducts.length > 0 && (
        <section
          className="low-stock-panel"
          aria-label="Low stock alert"
        >

          <div className="low-stock-header">

            <h2>⚠️ Low Stock Alert</h2>

            <span>
              {restockProducts.length} product
              {restockProducts.length > 1 ? "s" : ""} need
              restocking
            </span>

            <Link to="/dashboard/products">
              Manage products →
            </Link>

          </div>

          <div className="low-stock-list">

            {restockProducts.slice(0, 8).map((product) => (
              <div
                className="low-stock-item"
                key={product.id}
              >
                <span>{product.name}</span>

                <strong
                  className={product.stock === 0 ? "out" : ""}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : `${product.stock} left`}
                </strong>
              </div>
            ))}

          </div>

          {restockProducts.length > 8 && (
            <p className="low-stock-more">
              + {restockProducts.length - 8} more
            </p>
          )}

        </section>
      )}


      {/* =================================================
          INVENTORY MANAGEMENT
      ================================================= */}

      <section
        className="inventory-panel"
        id="stock"
      >

        <div className="inventory-header">

          <div>

            <span>
              STOCK CONTROL
            </span>

            <h2>
              Inventory Management
            </h2>

          </div>

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
              {safeInventory.length}
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

              {safeInventory.map(
                (product) => (

                  <tr
                    key={product.id}
                  >

                    <td>

                      <div className="inventory-product">

                        <img
                          src={
                            product.image ||
                            "https://via.placeholder.com/60"
                          }
                          alt={
                            product.name
                          }
                        />

                        <strong>
                          {product.name}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {product.category}
                    </td>


                    <td>

                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString()}

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
                            Number(
                              product.stock
                            ) === 0
                          }
                        >
                          −
                        </button>


                        <span>
                          {product.stock}
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

                        {getStockStatus(
                          product.stock
                        )}

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


          {safeInventory.length === 0 && (

            <div className="dashboard-empty">

              <div>
                📦
              </div>

              <h3>
                No Products Found
              </h3>

              <p>
                Products could not be loaded
                from the backend.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          ORDER MANAGEMENT
      ================================================= */}

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


          {safeOrders.length > 5 && (
            <a
              href="#orders"
              onClick={(e) => {
                e.preventDefault();
                setShowAllOrders(
                  (previous) => !previous
                );
              }}
            >
              {showAllOrders
                ? "Show Less ↑"
                : `View All (${safeOrders.length}) →`}
            </a>
          )}

        </div>


        {safeOrders.length === 0 ? (

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

            {visibleOrders
              .map((order) => {

                const itemCount =
                  Array.isArray(order.items)
                    ? order.items.reduce(
                        (total, item) =>
                          total +
                          (Number(
                            item.quantity
                          ) || 0),
                        0
                      )
                    : 0;


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
                        {order.customer?.name ||
                          "Customer"}
                      </span>

                      <small>
                        {order.date || "N/A"}
                      </small>

                      {order.paymentMethod && (
                        <small>
                          💳 {order.paymentMethod}
                          {order.paymentStatus
                            ? ` · ${order.paymentStatus}`
                            : ""}
                        </small>
                      )}

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
                      {Number(
                        order.total || 0
                      ).toLocaleString()}

                    </strong>


                    {/* ORDER STATUS */}

                    <span
                      className={`order-status ${String(
                        order.status || ""
                      )
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {order.status}
                    </span>


                    {/* STATUS BUTTON */}

                    {getNextStatus(
                      order.status
                    ) && (

                      <button
                        type="button"
                        className="status-update-btn"
                        onClick={() =>
                          handleStatusUpdate(
                            order
                          )
                        }
                      >
                        {getStatusButtonText(
                          order.status
                        )}
                      </button>

                    )}


                    {/* CANCEL BUTTON */}

                    {(order.status === "PENDING" ||
                      order.status === "CONFIRMED") && (

                      <button
                        type="button"
                        className="cancel-order-btn"
                        onClick={() =>
                          handleCancelOrder(order)
                        }
                      >
                        Cancel
                      </button>

                    )}

                  </div>

                );

              })}

          </div>

        )}

      </section>


      {/* =================================================
          CART + STOCK ALERTS
      ================================================= */}

      <div className="dashboard-grid">


        {/* =================================================
            STOCK ALERTS
        ================================================= */}

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


          {outOfStockProducts.length > 0 && (

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


          {lowStockProducts.length > 0 && (

            <div className="alert-box warning-alert">

              <strong>
                ⚠️ Low Stock
              </strong>

              <p>

                {lowStockProducts.length}{" "}
                product
                {lowStockProducts.length !== 1
                  ? "s"
                  : ""}{" "}
                need attention.

              </p>

            </div>

          )}


          {lowStockProducts.length === 0 &&
            outOfStockProducts.length === 0 && (

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
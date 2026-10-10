import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
    getStock,
  } = useCart();

  const { isWished, toggleWishlist } = useWishlist();

  // Move an item from the cart to the wishlist
  const saveForLater = (item) => {

    if (!isWished(item.id) && !toggleWishlist(item.id)) {
      alert("Please login to use your wishlist.");
      return;
    }

    removeFromCart(item.id);

    alert(`${item.name} moved to your wishlist.`);
  };

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const hasStockProblem = cart.some(
    (item) =>
      getStock(item.id) < item.quantity
  );

  if (cart.length === 0) {
    return (
      <main className="page cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            You haven't added any products
            to your cart yet.
          </p>

          <Link
            to="/products"
            className="shop-btn"
          >
            Continue Shopping →
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="page cart-page">

      <section className="page-header">

        <span>SHOPPING CART</span>

        <h1>Your Cart</h1>

        <p>
          Review your selected products
          before placing your order.
        </p>

      </section>

      {hasStockProblem && (
        <div className="cart-warning">

          ⚠️ Some products in your cart
          no longer have enough stock.
          Please adjust the quantity before
          checkout.

        </div>
      )}

      <div className="cart-container">

        <section className="cart-items">

          {cart.map((item) => {

            const currentStock =
              getStock(item.id);

            const stockExceeded =
              item.quantity >
              currentStock;

            return (
              <div
                className={
                  stockExceeded
                    ? "cart-item stock-problem"
                    : "cart-item"
                }
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">

                  <span className="product-category">
                    {item.category}
                  </span>

                  <h2>{item.name}</h2>

                  <p>{item.brand}</p>

                  <strong>
                    ₹{item.price.toLocaleString()}
                  </strong>

                  <div className="cart-stock">

                    {currentStock > 0 ? (
                      <>
                        <span>
                          Available:
                        </span>

                        <strong>
                          {currentStock}
                        </strong>
                      </>
                    ) : (
                      <strong className="cart-out-stock">
                        Out of Stock
                      </strong>
                    )}

                  </div>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      disabled={
                        currentStock === 0 ||
                        item.quantity >=
                          currentStock
                      }
                    >
                      +
                    </button>

                  </div>

                  {stockExceeded && (
                    <p className="stock-error">
                      Only {currentStock} available.
                      Please reduce quantity.
                    </p>
                  )}

                </div>

                <div className="cart-item-right">

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </strong>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                  <button
                    type="button"
                    className="save-later-btn"
                    onClick={() => saveForLater(item)}
                  >
                    ♡ Save for later
                  </button>

                </div>

              </div>
            );
          })}

          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </section>

        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Products</span>

            <span>
              {cart.length}
            </span>

          </div>

          <div className="summary-row">

            <span>Total Items</span>

            <span>
              {totalItems}
            </span>

          </div>

          <div className="summary-row">

            <span>Subtotal</span>

            <span>
              ₹{cartTotal.toLocaleString()}
            </span>

          </div>

          <div className="summary-row">

            <span>Delivery</span>

            <span>FREE</span>

          </div>

          <hr />

          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹{cartTotal.toLocaleString()}
            </strong>

          </div>

          {hasStockProblem ? (
            <button
              className="checkout-btn checkout-disabled"
              disabled
            >
              Fix Stock Before Checkout
            </button>
          ) : (
            <Link
              to="/checkout"
              className="checkout-btn"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Proceed to Checkout →
            </Link>
          )}

          <Link
            to="/products"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </aside>

      </div>

    </main>
  );
}

export default Cart;
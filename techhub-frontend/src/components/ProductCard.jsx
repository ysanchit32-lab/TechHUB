import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const { getProductStock } = useInventory();
  const { isWished, toggleWishlist } = useWishlist();
  const { isCompared, toggleCompare } = useCompare();

  const handleCompare = () => {
    if (toggleCompare(product.id) === "full") {
      alert("You can compare up to 3 products. Remove one first.");
    }
  };

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  // Employees do not shop, so only customers see the heart
  const canWishlist =
    !!savedUser && savedUser.role !== "EMPLOYEE";

  const wished = isWished(product.id);

  const handleWishlist = () => {
    if (!toggleWishlist(product.id)) {
      alert("Please login to use your wishlist.");
    }
  };

  const currentStock = getProductStock(product.id);

  const cartItem = cart.find(
    (item) => item.id === product.id
  );

  const cartQuantity = cartItem
    ? cartItem.quantity
    : 0;

  const remainingStock = currentStock - cartQuantity;

  const handleAddToCart = () => {
    if (remainingStock <= 0) {
      alert("You have reached the available stock!");
      return;
    }

    addToCart(product);
  };

  return (
    <div className="product-card">

      {canWishlist && (
        <button
          type="button"
          className={
            wished
              ? "wishlist-heart active"
              : "wishlist-heart"
          }
          onClick={handleWishlist}
          aria-label={
            wished
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            wished
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {wished ? "♥" : "♡"}
        </button>
      )}

      <Link
        to={`/products/${product.id}`}
        className="product-image"
      >
        {currentStock === 0 && (
          <span className="card-badge out">
            Out of stock
          </span>
        )}

        {currentStock > 0 && currentStock <= 5 && (
          <span className="card-badge low">
            Only {currentStock} left
          </span>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
          />
        ) : (
          <div className="no-image">
            <span>📦</span>
            <p>No Image Available</p>
          </div>
        )}
      </Link>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <strong className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </strong>

        <div className="product-bottom">

          <span
            className={
              currentStock > 5
                ? "stock available"
                : currentStock > 0
                ? "stock low"
                : "stock unavailable"
            }
          >
            {currentStock > 0
              ? `${currentStock} in stock`
              : "Out of stock"}
          </span>

        </div>

        {cartQuantity > 0 && currentStock > 0 && (
          <small className="cart-stock-info">
            {cartQuantity} already in cart
          </small>
        )}

        <button
          className="add-cart"
          onClick={handleAddToCart}
          disabled={
            currentStock === 0 ||
            remainingStock <= 0
          }
        >
          {currentStock === 0
            ? "Out of Stock"
            : remainingStock <= 0
            ? "Stock Limit Reached"
            : "🛒 Add to Cart"}
        </button>

        <button
          type="button"
          className={
            isCompared(product.id)
              ? "compare-toggle active"
              : "compare-toggle"
          }
          onClick={handleCompare}
          aria-pressed={isCompared(product.id)}
        >
          {isCompared(product.id)
            ? "✓ Added to compare"
            : "⇄ Compare"}
        </button>

      </div>
    </div>
  );
}

export default ProductCard;
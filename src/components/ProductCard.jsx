import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const { getProductStock } = useInventory();

  const currentStock = getProductStock(product.id);

  const cartItem = cart.find(
    (item) => item.id === product.id
  );

  const cartQuantity = cartItem
    ? cartItem.quantity
    : 0;

  const remainingStock =
    currentStock - cartQuantity;

  const handleAddToCart = () => {
    if (remainingStock <= 0) {
      alert("You have reached the available stock!");
      return;
    }

    addToCart(product);
  };

  return (
    <div className="product-card">

      <Link
        to={`/products/${product.id}`}
        className="product-image"
      >
        <img
          src={product.image}
          alt={product.name}
        />
      </Link>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <strong className="product-price">
          ₹{product.price.toLocaleString()}
        </strong>

        <p className="brand">
          {product.brand}
        </p>

        <div className="rating">
          ⭐ {product.rating}
        </div>

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

        {cartQuantity > 0 &&
          currentStock > 0 && (
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

      </div>
    </div>
  );
}

export default ProductCard;
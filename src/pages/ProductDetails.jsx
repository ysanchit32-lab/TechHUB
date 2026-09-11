import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart, cart } = useCart();

  const {
    getProductStock,
  } = useInventory();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="page">
        <div className="no-products">
          <h2>Product Not Found</h2>

          <Link to="/products">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const currentStock =
    getProductStock(product.id);

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
    <main className="page product-details-page">

      <Link
        to="/products"
        className="back-products"
      >
        ← Back to Products
      </Link>

      <section className="product-details">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="details-brand">
            Brand: {product.brand}
          </p>

          <div className="details-rating">
            ⭐ {product.rating}
          </div>

          <h2 className="details-price">
            ₹{product.price.toLocaleString()}
          </h2>

          <div
            className={
              currentStock > 5
                ? "details-stock in-stock"
                : currentStock > 0
                ? "details-stock low-stock"
                : "details-stock out-stock"
            }
          >
            {currentStock > 5
              ? `✓ ${currentStock} units available`
              : currentStock > 0
              ? `⚠ Only ${currentStock} units left`
              : "✕ Currently Out of Stock"}
          </div>

          {cartQuantity > 0 && (
            <p className="details-cart-info">
              {cartQuantity} unit
              {cartQuantity > 1 ? "s" : ""} already
              in your cart.
            </p>
          )}

          <p className="details-description">
            {product.description}
          </p>

          <button
            className="details-add-cart"
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

          <div className="product-features">

            <h2>Specifications</h2>

            {product.features.map(
              (feature, index) => (
                <div
                  className="feature"
                  key={index}
                >
                  ✓ {feature}
                </div>
              )
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;
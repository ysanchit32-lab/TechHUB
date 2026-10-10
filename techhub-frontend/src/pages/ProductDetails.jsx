import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart, cart } = useCart();
  const { isWished, toggleWishlist } = useWishlist();

  // Start at the top when moving between related products
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // ---------- Reviews ----------
  const productId = Number(id);

  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/reviews`
      );

      if (response.ok) {
        setReviews(await response.json());
      }
    } catch (error) {
      console.error("Could not load reviews:", error);
    }
  };

  useEffect(() => {

    loadReviews();

    setCanReview(false);
    setMyRating(0);
    setMyComment("");

    const token = localStorage.getItem("techhub-token");

    const user = JSON.parse(
      localStorage.getItem("techhub-user") || "null"
    );

    if (!token || !user || user.role === "EMPLOYEE") {
      return;
    }

    const checkPermission = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/reviews/can-review/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setCanReview(!!data.canReview);

        if (data.myReview) {
          setMyRating(data.myReview.rating);
          setMyComment(data.myReview.comment || "");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkPermission();
  }, [productId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length
    : 0;

  const stars = (value) =>
    "★".repeat(Math.round(value)) +
    "☆".repeat(5 - Math.round(value));

  const handleSubmitReview = async (e) => {

    e.preventDefault();

    if (myRating < 1) {
      alert("Please choose a star rating.");
      return;
    }

    const token = localStorage.getItem("techhub-token");

    setSubmittingReview(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            rating: myRating,
            comment: myComment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Could not save your review.");
        return;
      }

      alert("Thank you! Your review was saved.");

      loadReviews();

    } catch (error) {
      console.error(error);
      alert("Could not save your review. Is the backend running?");
    } finally {
      setSubmittingReview(false);
    }
  };

  const {
    inventory,
    loading,
    getProductStock,
  } = useInventory();

  // Products come from the Spring Boot backend
  const product = inventory.find(
    (item) => item.id === Number(id)
  );

  if (loading) {
    return (
      <main className="page">
        <div className="no-products">
          <h2>Loading product...</h2>
        </div>
      </main>
    );
  }

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

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const canWishlist =
    !!savedUser && savedUser.role !== "EMPLOYEE";

  const handleWishlist = () => {
    if (!toggleWishlist(product.id)) {
      alert("Please login to use your wishlist.");
    }
  };

  // Up to 4 other products from the same category
  const relatedProducts = inventory
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  // Specs are stored as one text value separated by "|"
  const specsList = product.specs
    ? product.specs
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

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
        </div>

        <div className="product-details-info">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          {reviews.length > 0 && (
            <p
              className="details-rating"
              aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
            >
              <span className="stars">
                {stars(averageRating)}
              </span>{" "}
              {averageRating.toFixed(1)} ({reviews.length}{" "}
              review{reviews.length > 1 ? "s" : ""})
            </p>
          )}

          {product.brand && (
            <p className="details-brand">
              Brand: {product.brand}
            </p>
          )}

          <h2 className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
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
            {product.description ||
              `${product.name} from our ${product.category} collection, available at TechHUB.`}
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

          {canWishlist && (
            <button
              type="button"
              className={
                isWished(product.id)
                  ? "details-wishlist-btn active"
                  : "details-wishlist-btn"
              }
              onClick={handleWishlist}
            >
              {isWished(product.id)
                ? "♥ Saved to Wishlist"
                : "♡ Add to Wishlist"}
            </button>
          )}

          <div className="product-features">

            <h2>Specifications</h2>

            {specsList.length > 0 ? (
              specsList.map((spec, index) => (
                <div
                  className="feature"
                  key={index}
                >
                  ✓ {spec}
                </div>
              ))
            ) : (
              <div className="feature">
                ✓ Category: {product.category}
              </div>
            )}

          </div>

        </div>

      </section>

      <section className="reviews-section">

        <h2>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="review-note">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div className="review-list">
            {reviews.map((item) => (
              <article className="review-card" key={item.id}>

                <div className="review-head">
                  <strong>{item.name}</strong>
                  <span className="stars">
                    {stars(item.rating)}
                  </span>
                </div>

                {item.comment && <p>{item.comment}</p>}

                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ""}
                </small>

              </article>
            ))}
          </div>
        )}

        {canReview ? (
          <form
            className="review-form"
            onSubmit={handleSubmitReview}
          >

            <h3>
              {myRating > 0 ? "Your review" : "Write a review"}
            </h3>

            <div
              className="star-picker"
              role="radiogroup"
              aria-label="Your rating"
            >
              {[1, 2, 3, 4, 5].map((number) => (
                <button
                  type="button"
                  key={number}
                  className={
                    number <= (hoverRating || myRating)
                      ? "star on"
                      : "star"
                  }
                  onMouseEnter={() => setHoverRating(number)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMyRating(number)}
                  aria-label={`${number} star${number > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              maxLength="1000"
              placeholder="Share your experience (optional)"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
            />

            <button
              type="submit"
              className="details-add-cart"
              disabled={submittingReview}
            >
              {submittingReview ? "Saving..." : "Submit Review"}
            </button>

          </form>
        ) : (
          <p className="review-note">
            Only customers who have bought this product can
            write a review.
          </p>
        )}

      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">

          <h2>You May Also Like</h2>

          <div className="products-grid">

            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default ProductDetails;

import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import ProductSkeletons from "../components/ProductSkeletons";
import { useInventory } from "../context/InventoryContext";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {

  const { inventory, loading } = useInventory();

  const { wishlistIds } = useWishlist();

  const savedProducts = inventory.filter((product) =>
    wishlistIds.includes(product.id)
  );

  if (loading) {
    return (
      <main className="page products-page">
        <ProductSkeletons count={4} />
      </main>
    );
  }

  return (
    <main className="page products-page">

      <section className="page-header">

        <span>YOUR WISHLIST</span>

        <h1>Saved Products</h1>

        <p>
          Products you saved to buy later.
        </p>

      </section>

      {savedProducts.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            ♡
          </div>

          <h1>Your Wishlist is Empty</h1>

          <p>
            Tap the heart on any product
            to save it here.
          </p>

          <Link to="/products" className="shop-btn">
            Browse Products →
          </Link>

        </div>

      ) : (

        <>
          <div className="products-top">

            <h2>Wishlist</h2>

            <span>
              {savedProducts.length} saved
            </span>

          </div>

          <section className="products-grid">

            {savedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </section>
        </>
      )}

    </main>
  );
}

export default Wishlist;

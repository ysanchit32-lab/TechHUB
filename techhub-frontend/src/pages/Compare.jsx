import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useInventory } from "../context/InventoryContext";

function Compare() {

  const { addToCart } = useCart();

  const { inventory, loading, getProductStock } = useInventory();

  const { compareIds, removeFromCompare, clearCompare } =
    useCompare();

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const isEmployee = savedUser?.role === "EMPLOYEE";

  const products = compareIds
    .map((id) => inventory.find((product) => product.id === id))
    .filter(Boolean);

  const lowestPrice = products.length
    ? Math.min(...products.map((product) => product.price))
    : 0;

  const specsOf = (product) =>
    product.specs
      ? product.specs
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  if (loading) {
    return (
      <main className="page">
        <div className="no-products">
          <h2>Loading...</h2>
        </div>
      </main>
    );
  }

  if (products.length < 2) {
    return (
      <main className="page">

        <section className="page-header">
          <span>COMPARE</span>
          <h1>Compare Products</h1>
          <p>Choose 2 or 3 products to see them side by side.</p>
        </section>

        <div className="empty-cart">

          <div className="empty-cart-icon">⇄</div>

          <h1>Nothing to Compare Yet</h1>

          <p>
            Tap "Compare" on at least two products
            on the Products page.
          </p>

          <Link to="/products" className="shop-btn">
            Browse Products →
          </Link>

        </div>

      </main>
    );
  }

  const handleAdd = (product) => {
    if (getProductStock(product.id) <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product);
  };

  return (
    <main className="page compare-page">

      <section className="page-header">
        <span>COMPARE</span>
        <h1>Compare Products</h1>
        <p>See the key details side by side.</p>
      </section>

      <div className="compare-top">

        <Link to="/products" className="back-products">
          ← Back to Products
        </Link>

        <button
          type="button"
          className="compare-clear"
          onClick={clearCompare}
        >
          Clear all
        </button>

      </div>

      <div className="compare-table-wrap">

        <table className="compare-table">

          <thead>
            <tr>
              <th scope="col">Product</th>

              {products.map((product) => (
                <th scope="col" key={product.id}>

                  <Link to={`/products/${product.id}`}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="compare-no-image">📦</div>
                    )}

                    <span>{product.name}</span>
                  </Link>

                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            <tr>
              <th scope="row">Price</th>
              {products.map((product) => (
                <td
                  key={product.id}
                  className={
                    product.price === lowestPrice
                      ? "compare-best"
                      : ""
                  }
                >
                  ₹{product.price.toLocaleString("en-IN")}
                  {product.price === lowestPrice && (
                    <small> Lowest price</small>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <th scope="row">Brand</th>
              {products.map((product) => (
                <td key={product.id}>{product.brand || "—"}</td>
              ))}
            </tr>

            <tr>
              <th scope="row">Category</th>
              {products.map((product) => (
                <td key={product.id}>{product.category}</td>
              ))}
            </tr>

            <tr>
              <th scope="row">Availability</th>
              {products.map((product) => {
                const stock = getProductStock(product.id);

                return (
                  <td key={product.id}>
                    {stock > 5
                      ? `In stock (${stock})`
                      : stock > 0
                      ? `Only ${stock} left`
                      : "Out of stock"}
                  </td>
                );
              })}
            </tr>

            <tr>
              <th scope="row">Specifications</th>
              {products.map((product) => (
                <td key={product.id}>
                  {specsOf(product).length > 0 ? (
                    <ul>
                      {specsOf(product).map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <th scope="row"></th>
              {products.map((product) => (
                <td key={product.id}>

                  {!isEmployee && (
                    <button
                      type="button"
                      className="add-cart"
                      onClick={() => handleAdd(product)}
                    >
                      🛒 Add to Cart
                    </button>
                  )}

                  <button
                    type="button"
                    className="compare-remove"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    Remove
                  </button>

                </td>
              ))}
            </tr>

          </tbody>

        </table>

      </div>

    </main>
  );
}

export default Compare;

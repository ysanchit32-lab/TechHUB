import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import ProductCard from "../components/ProductCard";
import ProductSkeletons from "../components/ProductSkeletons";

const PAGE_SIZE = 12;

function Products() {
  const { inventory, loading, getProductStock } = useInventory();

  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory || "All"
  );

  const [search, setSearch] = useState("");

  // Sorting and extra filters
  const [sortBy, setSortBy] = useState("default");
  const [priceLimit, setPriceLimit] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  // "Load more" - show 12 products at a time
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedCategory, sortBy, priceLimit, inStockOnly]);

  const highestPrice = inventory.reduce(
    (max, product) => Math.max(max, product.price),
    0
  );

  // null means "no limit chosen yet" = show everything
  const activeLimit =
    priceLimit === null ? highestPrice : priceLimit;

  const categories = [
    "All",
    "Office Laptop",
    "Gaming Laptop",
    "PC",
    "Custom PC",
    "Components",
    "Accessories",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: category,
      });
    }
  };

  const filteredProducts = inventory.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      (product.brand || "")
        .toLowerCase()
        .includes(searchText);

    const matchesPrice = product.price <= activeLimit;

    const matchesStock =
      !inStockOnly || getProductStock(product.id) > 0;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesStock
    );
  });

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock") {
        return getProductStock(b.id) - getProductStock(a.id);
      }
      return 0;
    }
  );

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("default");
    setPriceLimit(null);
    setInStockOnly(false);
    setSearchParams({});
  };

  if (loading) {
    return (
      <main className="page products-page">
        <ProductSkeletons count={8} />
      </main>
    );
  }

  return (
    <main className="page products-page">

      {/* PAGE HEADER */}
      <section className="page-header">

        <span>TECHHUB STORE</span>

        <h1>Our Products</h1>

        <p>
          Explore laptops, PCs, components and accessories
          for every requirement.
        </p>

      </section>


      {/* SEARCH + FILTERS */}
      <section className="products-controls">

        <div className="search-box">

          <input
            type="text"
            placeholder="Search products, brands or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <div className="category-filters">

          {categories.map((category) => (

            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>

          ))}

        </div>

        <div className="extra-filters">

          <label className="filter-control">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="stock">Most in stock</option>
            </select>
          </label>

          <label className="filter-control price-control">
            <span>
              Max price: ₹{activeLimit.toLocaleString("en-IN")}
            </span>
            <input
              type="range"
              min="0"
              max={highestPrice}
              step="1000"
              value={activeLimit}
              onChange={(e) =>
                setPriceLimit(Number(e.target.value))
              }
            />
          </label>

          <label className="filter-check">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>

          <button
            type="button"
            className="filter-reset"
            onClick={clearFilters}
          >
            Reset
          </button>

        </div>

      </section>


      {/* PRODUCT COUNT */}
      <div className="products-top">

        <h2>
          {selectedCategory === "All"
            ? "All Products"
            : selectedCategory}
        </h2>

        <span>
          {sortedProducts.length} products found
        </span>

      </div>


      {/* PRODUCTS */}
      {sortedProducts.length > 0 ? (

        <section className="products-grid">

          {sortedProducts
            .slice(0, visibleCount)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          {sortedProducts.length > visibleCount && (
            <div className="load-more-wrap">
              <button
                type="button"
                className="load-more-btn"
                onClick={() =>
                  setVisibleCount(
                    (count) => count + PAGE_SIZE
                  )
                }
              >
                Load more (
                {sortedProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}

        </section>

      ) : (

        <div className="no-products">

          <div>🔍</div>

          <h2>No Products Found</h2>

          <p>
            Try another search or select a different category.
          </p>

          <button onClick={clearFilters}>
            Show All Products
          </button>

        </div>

      )}


      {/* BOTTOM CTA */}
      <section className="products-bottom">

        <h2>Need Help Choosing?</h2>

        <p>
          Our customer service team can help you find
          the right product for your needs.
        </p>

        <Link to="/customer-service">
          Contact Customer Service →
        </Link>

      </section>

    </main>
  );
}

export default Products;
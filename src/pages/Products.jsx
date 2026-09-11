import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory || "All"
  );

  const [search, setSearch] = useState("");

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

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSearchParams({});
  };

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

      </section>


      {/* PRODUCT COUNT */}
      <div className="products-top">

        <h2>
          {selectedCategory === "All"
            ? "All Products"
            : selectedCategory}
        </h2>

        <span>
          {filteredProducts.length} products found
        </span>

      </div>


      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (

        <section className="products-grid">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

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
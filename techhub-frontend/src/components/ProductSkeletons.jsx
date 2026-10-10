// Grey placeholder cards shown while products are loading
function ProductSkeletons({ count = 8 }) {

  return (
    <section
      className="products-grid"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>

          <div className="skeleton skeleton-image" />

          <div className="skeleton-body">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-button" />
          </div>

        </div>
      ))}
    </section>
  );
}

export default ProductSkeletons;

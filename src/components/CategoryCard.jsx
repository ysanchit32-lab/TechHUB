import { Link } from "react-router-dom";

function CategoryCard({ name, icon, image }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      className="category-card"
    >
      <img src={image} alt={name} />
      <div className="category-overlay">
        <span>{icon}</span>
        <h3>{name}</h3>
        <p>Explore Products →</p>
      </div>
    </Link>
  );
}

export default CategoryCard;
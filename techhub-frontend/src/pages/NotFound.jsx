import { Link } from "react-router-dom";

function NotFound() {

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const homePath =
    savedUser?.role === "EMPLOYEE" ? "/dashboard" : "/";

  return (
    <main className="page not-found-page">

      <div className="not-found">

        <span className="not-found-code">404</span>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for does not exist
          or has been moved.
        </p>

        <div className="not-found-actions">

          <Link to={homePath} className="shop-btn">
            ← Back to Home
          </Link>

          <Link to="/products" className="not-found-link">
            Browse Products
          </Link>

        </div>

      </div>

    </main>
  );
}

export default NotFound;

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <h2>
            Tech<span>HUB</span>
          </h2>

          <p>
            Smart inventory management for modern
            computer stores.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/products">Products</a>
          <a href="/orders">Order History</a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>

          <a href="/about">About Us</a>
          <a href="/customer-service">Customer Service</a>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 TechHUB. All Rights Reserved.</p>
        <p>Licensed Inventory Management System</p>
      </div>

    </footer>
  );
}

export default Footer;
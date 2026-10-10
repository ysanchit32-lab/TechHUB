function Footer() {

  const token =
    localStorage.getItem("techhub-token");

  const user = JSON.parse(
    localStorage.getItem("techhub-user") ||
    "null"
  );

  const isEmployee =
    !!token &&
    user?.role === "EMPLOYEE";


  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">

          <h2>
            Tech<span>HUB</span>
          </h2>

          <p>
            Smart inventory management for
            modern computer stores.
          </p>

        </div>


        {isEmployee ? (

          <div className="footer-links">

            <h3>
              Employee
            </h3>

            <a href="/dashboard">
              Dashboard
            </a>

            <a href="/dashboard#stock">
              Stock Management
            </a>

            <a href="/dashboard#attendance">
              Clock In / Out
            </a>

          </div>

        ) : (

          <>

            <div className="footer-links">

              <h3>
                Quick Links
              </h3>

              <a href="/">
                Home
              </a>

              <a href="/dashboard">
                Dashboard
              </a>

              <a href="/products">
                Products
              </a>

              <a href="/orders">
                Order History
              </a>

            </div>


            <div className="footer-links">

              <h3>
                Company
              </h3>

              <a href="/about">
                About Us
              </a>

              <a href="/customer-service">
                Customer Service
              </a>

              <a href="/login">
                Login
              </a>

              <a href="/signup">
                Sign Up
              </a>

            </div>

          </>

        )}

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 TechHUB. All Rights Reserved.
        </p>

        <p>
          Licensed Inventory Management System
        </p>

      </div>

    </footer>
  );
}

export default Footer;
import { Link } from "react-router-dom";

function Home() {
  const categories = [
    {
      icon: "💼",
      title: "Office Laptops",
      description:
        "Reliable laptops designed for work, productivity and everyday business needs.",
      category: "Office Laptop",
    },
    {
      icon: "🎮",
      title: "Gaming Laptops",
      description:
        "High-performance gaming machines built for demanding games and applications.",
      category: "Gaming Laptop",
    },
    {
      icon: "🖥️",
      title: "Desktop PCs",
      description:
        "Powerful desktop computers for business, productivity and professional use.",
      category: "PC",
    },
    {
      icon: "⚙️",
      title: "Custom PCs",
      description:
        "Create your ideal system with carefully selected hardware and components.",
      category: "Custom PC",
    },
    {
      icon: "🔧",
      title: "Components",
      description:
        "Upgrade and expand your system with quality computer components.",
      category: "Components",
    },
    {
      icon: "🎧",
      title: "Accessories",
      description:
        "Complete your workstation or gaming setup with essential accessories.",
      category: "Accessories",
    },
  ];

  return (
    <main>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="page hero">

        <div className="hero-content">

          <span>
            SMART INVENTORY • SMART TECHNOLOGY
          </span>

          <h1>
            Everything You Need
            <br />
            <span>In One Place.</span>
          </h1>

          <p>
            Welcome to TechHUB — your complete destination
            for laptops, PCs, components and accessories.
            Discover quality technology while managing
            your inventory smarter.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="shop-btn"
            >
              Explore Products →
            </Link>

            <Link
              to="/dashboard"
              className="login-btn"
            >
              View Dashboard
            </Link>

          </div>

          <div className="hero-highlights">

            <div>
              <strong>18+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>6</strong>
              <span>Categories</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Management</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-card-main">

            <div className="hero-card-top">
              <span>TECHHUB</span>
              <span>INVENTORY</span>
            </div>

            <div className="hero-device">

              <div className="device-screen">

                <div className="device-screen-content">
                  <span>SMART</span>
                  <strong>INVENTORY</strong>
                  <small>MANAGEMENT</small>
                </div>

              </div>

              <div className="device-base"></div>

            </div>

            <div className="hero-card-stats">

              <div>
                <span>STOCK</span>
                <strong>ACTIVE</strong>
              </div>

              <div>
                <span>ORDERS</span>
                <strong>TRACKED</strong>
              </div>

            </div>

          </div>

          <div className="floating-card floating-card-one">

            <span>📦</span>

            <div>
              <small>INVENTORY</small>
              <strong>Live Stock</strong>
            </div>

          </div>

          <div className="floating-card floating-card-two">

            <span>🛒</span>

            <div>
              <small>ORDERS</small>
              <strong>Easy Management</strong>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CATEGORY SECTION
      ========================= */}

      <section className="page categories">

        <div className="section-title">

          <span>
            EXPLORE TECHHUB
          </span>

          <h2>
            Shop By Category
          </h2>

          <p>
            Find the right technology for work,
            gaming, productivity and your next build.
          </p>

        </div>

        <div className="category-grid">

          {categories.map((item) => (

            <Link
              to={`/products?category=${encodeURIComponent(
                item.category
              )}`}
              className="category-card"
              key={item.category}
            >

              <div className="category-icon">
                {item.icon}
              </div>

              <div className="category-card-content">

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                <span className="category-link">
                  Explore Category →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =========================
          INVENTORY MANAGEMENT
      ========================= */}

      <section className="page">

        <div className="contact-section">

          {/* LEFT SIDE - UNCHANGED */}

          <div className="contact-info">

            <span>
              SMART INVENTORY MANAGEMENT
            </span>

            <h2>
              Manage Your
              <br />
              <strong>Technology Better.</strong>
            </h2>

            <p>
              TechHUB combines technology shopping
              with smart inventory management.
              Track products, monitor stock and
              manage orders from one powerful platform.
            </p>

            <div className="contact-details">

              <p>
                <span>📦</span>
                Easy Product Management
              </p>

              <p>
                <span>📊</span>
                Real-Time Stock Monitoring
              </p>

              <p>
                <span>🛒</span>
                Simple Order Management
              </p>

              <p>
                <span>💻</span>
                Complete Computer Store Solution
              </p>

            </div>

            <Link
              to="/dashboard"
              className="shop-btn inventory-cta"
            >
              Manage Inventory →
            </Link>

          </div>


          {/* =========================
              IMPROVED INVENTORY PANEL
          ========================= */}

          <div className="dashboard-panel home-inventory-panel">

            <div className="panel-header">

              <div>

                <span>
                  TECHHUB SYSTEM
                </span>

                <h2>
                  Inventory Overview
                </h2>

              </div>

              <div className="inventory-live">
                <span></span>
                LIVE
              </div>

            </div>


            {/* INVENTORY GRID */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
                marginTop: "24px",
              }}
            >

              {/* OFFICE LAPTOPS */}

              <div
                style={{
                  minHeight: "82px",
                  padding: "18px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  background: "#1b1b1b",
                  border: "1px solid #2b2b2b",
                  borderRadius: "10px",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Office Laptops
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#777777",
                      fontSize: "12px",
                    }}
                  >
                    Work & Productivity
                  </p>

                </div>

                <strong
                  style={{
                    color: "#168cff",
                    fontSize: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  124 Units
                </strong>

              </div>


              {/* GAMING LAPTOPS */}

              <div
                style={{
                  minHeight: "82px",
                  padding: "18px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  background: "#1b1b1b",
                  border: "1px solid #2b2b2b",
                  borderRadius: "10px",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Gaming Laptops
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#777777",
                      fontSize: "12px",
                    }}
                  >
                    Gaming Performance
                  </p>

                </div>

                <strong
                  style={{
                    color: "#168cff",
                    fontSize: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  86 Units
                </strong>

              </div>


              {/* DESKTOP PCS */}

              <div
                style={{
                  minHeight: "82px",
                  padding: "18px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  background: "#1b1b1b",
                  border: "1px solid #2b2b2b",
                  borderRadius: "10px",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Desktop PCs
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#777777",
                      fontSize: "12px",
                    }}
                  >
                    Business & Professional
                  </p>

                </div>

                <strong
                  style={{
                    color: "#168cff",
                    fontSize: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  72 Units
                </strong>

              </div>


              {/* COMPONENTS */}

              <div
                style={{
                  minHeight: "82px",
                  padding: "18px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  background: "#1b1b1b",
                  border: "1px solid #2b2b2b",
                  borderRadius: "10px",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Components
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#777777",
                      fontSize: "12px",
                    }}
                  >
                    System Upgrades
                  </p>

                </div>

                <strong
                  style={{
                    color: "#168cff",
                    fontSize: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  218 Units
                </strong>

              </div>


              {/* ACCESSORIES */}

              <div
                style={{
                  minHeight: "82px",
                  padding: "18px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  background: "#1b1b1b",
                  border: "1px solid #2b2b2b",
                  borderRadius: "10px",
                  gridColumn: "1 / -1",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Accessories
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#777777",
                      fontSize: "12px",
                    }}
                  >
                    Complete Your Setup
                  </p>

                </div>

                <strong
                  style={{
                    color: "#168cff",
                    fontSize: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  356 Units
                </strong>

              </div>

            </div>


            {/* DASHBOARD BUTTON */}

            <div
              style={{
                marginTop: "24px",
              }}
            >

              <Link
                to="/dashboard"
                className="shop-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                Open Dashboard →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHY TECHHUB
      ========================= */}

      <section className="page home-features">

        <div className="section-title">

          <span>
            WHY TECHHUB?
          </span>

          <h2>
            Everything Under Control.
          </h2>

          <p>
            A simple and professional platform
            designed to make computer store
            management easier.
          </p>

        </div>

        <div className="home-feature-grid">

          <div className="home-feature-card">

            <div className="home-feature-icon">
              📊
            </div>

            <h3>
              Smart Inventory
            </h3>

            <p>
              Monitor product quantities and
              keep track of available stock
              from one dashboard.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              🛒
            </div>

            <h3>
              Simple Shopping
            </h3>

            <p>
              Browse products, manage your
              cart and complete orders through
              a clean shopping experience.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              📦
            </div>

            <h3>
              Order Tracking
            </h3>

            <p>
              Follow orders from processing
              through shipping and final delivery.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              🔐
            </div>

            <h3>
              Secure Access
            </h3>

            <p>
              Manage your account and access
              important management features
              through your TechHUB login.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="page home-cta-section">

        <div className="home-cta">

          <div>

            <span>
              READY TO GET STARTED?
            </span>

            <h2>
              Build Your Perfect Setup.
            </h2>

            <p>
              Browse our collection of laptops,
              PCs, components and accessories and
              find the technology that fits your needs.
            </p>

          </div>

          <div className="home-cta-buttons">

            <Link
              to="/products"
              className="shop-btn"
            >
              Browse All Products →
            </Link>

            <Link
              to="/customer-service"
              className="login-btn"
            >
              Need Help?
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
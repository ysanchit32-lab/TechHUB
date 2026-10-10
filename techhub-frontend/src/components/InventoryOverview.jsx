import React from "react";
import { Link } from "react-router-dom";

function InventoryOverview() {
  const categories = [
    {
      name: "Office Laptops",
      description: "Work & Productivity",
      units: 124,
    },
    {
      name: "Gaming Laptops",
      description: "Gaming Performance",
      units: 86,
    },
    {
      name: "Desktop PCs",
      description: "Business & Professional",
      units: 72,
    },
    {
      name: "Components",
      description: "System Upgrades",
      units: 218,
    },
    {
      name: "Accessories",
      description: "Complete Your Setup",
      units: 64,
    },
  ];

  return (
    <section className="inventory-overview">
      <div className="overview-header">
        <div className="overview-title">
          <span className="overview-label">
            TECHHUB SYSTEM
          </span>

          <h2>Inventory Overview</h2>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          LIVE
        </div>
      </div>

      <div className="inventory-categories">
        {categories.map((category, index) => (
          <div
            className="inventory-category"
            key={index}
          >
            <div className="category-information">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>

            <div className="category-units">
              {category.units} Units
            </div>
          </div>
        ))}
      </div>

      <div className="overview-button-container">
        <Link
          to="/dashboard"
          className="overview-dashboard-btn"
        >
          Open Dashboard
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}

export default InventoryOverview;
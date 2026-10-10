import { useState } from "react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";

// Saved delivery details are kept in this browser only.
// Checkout uses them to pre-fill the form.
export const getProfileKey = (email) =>
  `techhub-profile-${email}`;

function Profile() {

  const savedUser = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  const { wishlistCount } = useWishlist();

  const loadProfile = () => {
    try {
      return JSON.parse(
        localStorage.getItem(
          getProfileKey(savedUser?.email)
        ) || "{}"
      );
    } catch {
      return {};
    }
  };

  const [details, setDetails] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    ...loadProfile(),
  });

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      getProfileKey(savedUser?.email),
      JSON.stringify(details)
    );

    alert("Delivery details saved. Checkout will use them.");
  };

  const handleClear = () => {
    localStorage.removeItem(getProfileKey(savedUser?.email));

    setDetails({
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    alert("Saved delivery details removed.");
  };

  return (
    <main className="page profile-page">

      <section className="page-header">
        <span>MY ACCOUNT</span>
        <h1>My Profile</h1>
        <p>Manage your details and saved delivery address.</p>
      </section>

      <div className="profile-layout">

        <aside className="profile-card">

          <div className="profile-avatar">
            {(savedUser?.name || "U").charAt(0).toUpperCase()}
          </div>

          <h2>{savedUser?.name || "Customer"}</h2>

          <p>{savedUser?.email}</p>

          <div className="profile-links">
            <Link to="/orders">📦 My Orders</Link>
            <Link to="/wishlist">
              ♥ Wishlist ({wishlistCount})
            </Link>
            <Link to="/cart">🛒 My Cart</Link>
          </div>

        </aside>

        <section className="profile-form">

          <h2>Saved Delivery Details</h2>

          <form onSubmit={handleSave}>

            <div className="checkout-grid">

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={details.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={details.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={details.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={details.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  pattern="[0-9]{6}"
                  placeholder="6-digit pincode"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                name="address"
                rows="4"
                value={details.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
              />
            </div>

            <div className="profile-buttons">

              <button type="submit" className="checkout-btn">
                Save Details
              </button>

              <button
                type="button"
                className="compare-clear"
                onClick={handleClear}
              >
                Remove saved details
              </button>

            </div>

          </form>

        </section>

      </div>

    </main>
  );
}

export default Profile;

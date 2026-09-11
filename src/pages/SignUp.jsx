import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const existingUser = JSON.parse(
      localStorage.getItem("techhub-user") || "null"
    );

    if (
      existingUser &&
      existingUser.email.toLowerCase() === formData.email.toLowerCase()
    ) {
      alert("An account with this email already exists!");
      return;
    }

    const user = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    localStorage.setItem("techhub-user", JSON.stringify(user));

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <main className="page auth-page">
      <section className="auth-container">

        <div className="auth-header">
          <span>TECHHUB ACCOUNT</span>
          <h1>Create Account</h1>
          <p>Join TechHUB and manage your orders easily.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <label className="terms-checkbox">
            <input type="checkbox" required />
            <span>
              I agree to the TechHUB terms and conditions.
            </span>
          </label>

          <button type="submit" className="auth-btn">
            Create Account →
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default SignUp;
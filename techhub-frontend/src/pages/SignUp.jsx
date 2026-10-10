
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // Read response as text first
      const responseText = await response.text();

      // Try to convert JSON response into an object
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        // Backend returned plain text
        data = {
          message: responseText,
        };
      }

      // Handle registration errors
      if (!response.ok) {
        alert(
          data.message ||
            data.error ||
            "Registration failed!"
        );
        return;
      }

      // Registration successful
      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Cannot connect to the TechHUB server. Make sure Spring Boot is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-container">

        <div className="auth-header">
          <span>TECHHUB ACCOUNT</span>

          <h1>Create Account</h1>

          <p>
            Join TechHUB and manage your orders easily.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

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
              type={showPassword ? "text" : "password"}
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
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
            >
              {showPassword ? "🙈 Hide password" : "👁 Show password"}
            </button>
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              required
            />

            <span>
              I agree to the TechHUB terms and conditions.
            </span>
          </label>

          <button
            type="submit"
            className="auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Account →"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login">
              {" "}Login
            </Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default SignUp;

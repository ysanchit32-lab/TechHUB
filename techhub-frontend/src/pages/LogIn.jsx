import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          data.error ||
          "Invalid email or password!"
        );
        return;
      }

      localStorage.setItem(
        "techhub-token",
        data.token
      );

      localStorage.setItem(
        "techhub-user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      localStorage.setItem(
        "techhub-logged-in",
        "true"
      );

      alert(`Welcome back, ${data.name}!`);

      if (data.role === "EMPLOYEE") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to the TechHUB server. Make sure Spring Boot is running on port 8080."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-container">

        <div className="auth-header">
          <span>WELCOME BACK</span>

          <h1>Login</h1>

          <p>
            Login to access your TechHUB account.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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

          <button
            type="submit"
            className="auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?
            <Link to="/signup">
              {" "}Create Account
            </Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default LogIn;
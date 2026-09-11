import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(
      localStorage.getItem("techhub-user") || "null"
    );

    if (!savedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    if (
      email.toLowerCase() !== savedUser.email.toLowerCase() ||
      password !== savedUser.password
    ) {
      alert("Invalid email or password!");
      return;
    }

    localStorage.setItem(
      "techhub-logged-in",
      "true"
    );

    alert(`Welcome back, ${savedUser.name}!`);

    navigate("/dashboard");
  };

  return (
    <main className="page auth-page">
      <section className="auth-container">

        <div className="auth-header">
          <span>WELCOME BACK</span>
          <h1>Login</h1>
          <p>Login to access your TechHUB account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login →
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?
            <Link to="/signup"> Create Account</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default LogIn;
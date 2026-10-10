import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  employeeOnly = false,
  customerOnly = false,
}) {
  const token =
    localStorage.getItem("techhub-token");

  const user = JSON.parse(
    localStorage.getItem("techhub-user") ||
    "null"
  );

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* =========================
     EMPLOYEE ONLY
  ========================= */

  if (
    employeeOnly &&
    user.role !== "EMPLOYEE"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  /* =========================
     CUSTOMER ONLY
  ========================= */

  if (
    customerOnly &&
    user.role === "EMPLOYEE"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return children;
}

export default ProtectedRoute;
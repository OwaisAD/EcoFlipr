import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const SaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Specific sale offer page</h1>
    </div>
  );
};

export default SaleOffer;

import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const Profile = () => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>User Profile</h1>
    </div>
  );
};

export default Profile;

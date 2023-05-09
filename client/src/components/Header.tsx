import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { HiDocumentText } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useApolloClient } from "@apollo/client";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const client = useApolloClient();

  const handleLogOut = () => {
    console.log("Logging out");
    localStorage.clear();
    client.clearStore();
    navigate("/");
    window.location.reload();
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return;
  }

  return (
    <div className="w-full h-[80px] bg-gray-400 flex items-center justify-between px-6">
      <div className="hover:scale-105 duration-100 cursor-pointer" onClick={() => navigate("/")}>
        <img src={"../../images/ecoflipr-logo.png"} alt="logo" className="h-8"/>
      </div>
      {/* AUTHENTICATED */}
      {auth.isAuthenticated && (
        <div className="flex items-center gap-4">
          {/* SEARCH BOX IF NOT ON FRONT PAGE */}
          <div></div>

          {/* CREATE SAlE OFFER BUTTON */}

          <div className="bg-emerald-600 p-2 rounded-full hover:scale-105 cursor-pointer">
            <HiDocumentText className="text-white text-2xl" />
          </div>

          {/* PROFILE PAGE BUTTON */}
          <div className="relative bg-emerald-600 p-2 rounded-full hover:scale-105 cursor-pointer">
            <CgProfile className="text-white text-2xl" />
            <div className="absolute top-0 right-[-3px] bg-red-500 text-white rounded-full px-1">
              {/* if noti count > 99 should 99+ */}
              <p className="text-[9px]">1</p>
            </div>
          </div>

          {/* Sign in btn / Sign up btn */}
          <button
            className="bg-black rounded-full text-white font-medium px-4 py-2 hover:scale-105 duration-100"
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      )}

      {/* NOT AUTHENTICATED */}
      {!auth.isAuthenticated && (
        <div>
          {/* Sign in btn / Sign up btn */}
          <button
            className="bg-black rounded-full text-white font-medium px-4 py-2 hover:scale-105 duration-100"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;

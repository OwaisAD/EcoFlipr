import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { HiDocumentText } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useApolloClient } from "@apollo/client";
import { toast } from "react-hot-toast";
import { DarkModeSwitch } from "react-toggle-dark-mode";

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsHeaderSearch: React.Dispatch<React.SetStateAction<boolean>>;
  handleThemeSwitch: () => void;
  isDarkMode: boolean
};

const Header = ({ searchQuery, setSearchQuery, setIsHeaderSearch, handleThemeSwitch, isDarkMode }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const client = useApolloClient();

  const handleLogOut = () => {
    console.log("Logging out");
    localStorage.clear();
    client.clearStore();
    navigate("/");
    toast.loading("Logging out");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleHeaderSearch = () => {
    setIsHeaderSearch(true);
    navigate("/");
  };

  const toggleDarkMode = (checked: boolean) => {
    handleThemeSwitch();
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return;
  }

  return (
    <div className="w-full h-[80px] bg-gray-400 flex items-center justify-between px-6">
      <div
        className="hover:scale-105 duration-100 cursor-pointer"
        onClick={() => {
          if (location.pathname === "/") {
            window.location.reload();
          } else {
            navigate("/");
          }
        }}
      >
        <img src={"../../images/ecoflipr-logo-white.png"} alt="logo" className="h-8" />
      </div>
      {/* AUTHENTICATED */}
      <div>
        {auth.isAuthenticated && (
          <div className="flex items-center gap-4">
            {/* SEARCH BOX IF NOT ON FRONT PAGE */}
            {location.pathname !== "/" && (
              <form onSubmit={handleHeaderSearch}>
                <input
                  type="text"
                  className="rounded-lg border-none h-10 w-44 text-sm"
                  placeholder="Search for items..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </form>
            )}

            {/* CREATE SAlE OFFER BUTTON */}

            <div
              className="bg-emerald-600 p-2 rounded-full hover:scale-105 cursor-pointer"
              onClick={() => navigate("/createoffer")}
            >
              <HiDocumentText className="text-white text-2xl" />
            </div>

            {/* PROFILE PAGE BUTTON */}
            <div
              className="relative bg-emerald-600 p-2 rounded-full hover:scale-105 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
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
          <div className="flex items-center gap-4">
            <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} size={30} />
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
    </div>
  );
};

export default Header;

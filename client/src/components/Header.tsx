import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { HiDocumentText } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useApolloClient, useQuery } from "@apollo/client";
import { toast } from "react-hot-toast";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Squash } from "hamburger-react";
import { GET_USER_NOTIFICATION_COUNT } from "../GraphQL/queries/getUserNotificationCount";

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsHeaderSearch: React.Dispatch<React.SetStateAction<boolean>>;
  handleThemeSwitch: () => void;
  isDarkMode: boolean;
};

const Header = ({ searchQuery, setSearchQuery, setIsHeaderSearch, handleThemeSwitch, isDarkMode }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const client = useApolloClient();
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const { data } = useQuery(GET_USER_NOTIFICATION_COUNT, {
    skip: !auth.isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setNotificationCount(data.getUserNotificationCount);
    }
  }, [data]);

  const handleBurgerMenuClicked = () => setBurgerMenuOpen(!burgerMenuOpen);

  const handleLogOut = () => {
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

  const toggleDarkMode = () => {
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
      <div className="hidden sm:block">
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
              {notificationCount > 0 && (
                <div className="absolute top-0 right-[-3px] bg-red-500 text-white rounded-full px-1 animate-bounce">
                  {/* if noti count > 99 should 99+ */}
                  <p className="text-[9px]">{notificationCount}</p>
                </div>
              )}
            </div>

            {/* DARK MODE BTN */}
            <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} size={30} />

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

      {/* Burger menu */}
      <div className="block sm:hidden">
        <Squash toggled={burgerMenuOpen} toggle={handleBurgerMenuClicked} />
        {/* dropdown when burger menu is clicked */}
        {burgerMenuOpen && (
          <div className="absolute z-50 w-[97%] md:block top-12 right-2 ml-2">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-10 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {!auth.isAuthenticated && (
                <p
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                  onClick={() => {
                    setBurgerMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </p>
              )}

              {location.pathname !== "/" && (
                <input
                  type="text"
                  className="rounded-lg border border-gray-200 h-10 w-44 text-sm block py-2 pl-3 pr-4"
                  placeholder="Search for items..."
                />
              )}

              {auth.isAuthenticated && (
                <>
                  <p
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                    onClick={() => {
                      setBurgerMenuOpen(false);
                      navigate("/createoffer");
                    }}
                  >
                    Create offer
                  </p>

                  <p
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                    onClick={() => {
                      setBurgerMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </p>

                  <p
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                    onClick={() => {
                      setBurgerMenuOpen(false);
                      handleLogOut();
                    }}
                  >
                    Log out
                  </p>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

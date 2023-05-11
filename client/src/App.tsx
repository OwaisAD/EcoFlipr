import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateSaleOffer from "./pages/CreateSaleOffer";
import SaleOffer from "./pages/SaleOffer";
import Profile from "./pages/Profile";
import EditSaleOffer from "./pages/EditSaleOffer";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Toaster, toast } from "react-hot-toast";
import Error from "./pages/Error";
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { setContext } from "@apollo/client/link/context";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      toast.error(`${message}`);
    });
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("ecoflipr-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = from([errorLink, new HttpLink({ uri: "http://localhost:3001/graphql" })]);

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeaderSearch, setIsHeaderSearch] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const [isDarkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    if (theme === "dark") {
      toast("Switched to light-mode", {
        icon: "☀️",
        style: {
          borderRadius: "10px",
          background: "#FFF",
          color: "#333",
        },
        position: "bottom-right",
      });
    } else {
      toast("Switched to dark-mode", {
        icon: "🌙",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/");
      return;
    }

    // Check if there's a stored path in local storage
    const lastPath = localStorage.getItem("lastPath");
    if (auth.isAuthenticated && lastPath) {
      // Remove the stored path from local storage
      localStorage.removeItem("lastPath");
      // Redirect the user to the stored path
      navigate(lastPath);
    } else if (auth.isAuthenticated && location.pathname === "/login") {
      navigate("/");
    }
  }, [auth.isAuthenticated]);

  // LOAD USER SALE OFFERS AND USER INTERACTED SALE OFFERS AND PASS INTO PROFILE

  return (
    <ApolloProvider client={client}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsHeaderSearch={setIsHeaderSearch}
        handleThemeSwitch={handleThemeSwitch}
        isDarkMode={isDarkMode}
      />
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isHeaderSearch={isHeaderSearch}
              setIsHeaderSearch={setIsHeaderSearch}
            />
          }
        />
        <Route path="/createoffer" element={<CreateSaleOffer />} />
        <Route path="/editoffer/:id" element={<EditSaleOffer />} />
        <Route path="/offer/:id" element={<SaleOffer />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;

import { useState } from "react";
import { Route, Routes } from "react-router-dom";
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      toast.error(`${message}`);
    });
  }
});

const link = from([errorLink, new HttpLink({ uri: "http://localhost:3001/graphql" })]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <ApolloProvider client={client}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
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

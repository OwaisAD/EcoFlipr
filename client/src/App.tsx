import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateSaleOffer from "./pages/CreateSaleOffer";
import SaleOffer from "./pages/SaleOffer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createoffer" element={<CreateSaleOffer />} />
        <Route path="/offer" element={<SaleOffer />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

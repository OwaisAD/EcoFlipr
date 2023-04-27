import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full h-[80px] bg-gray-400 flex items-center justify-between">
      <p>1</p>
      <p>2</p>
      <p>3</p>
    </div>
  );
};

export default Header;

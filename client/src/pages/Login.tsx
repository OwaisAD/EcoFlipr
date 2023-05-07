import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* left side */}
      <div className="relative w-full">
        <img
          src={"../../images/signin_background.jpg"}
          alt="sign in background image"
          className="object-cover w-full h-full"
        />
        {/* color on top of image layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
      </div>
      {/* right side with inputs */}
      <div className="bg-white flex flex-col justify-center min-w-[640px] max-w-full  py-[35px] px-[70px]">
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </div>
    </div>
  );
};

export default Login;

import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { LOGIN } from "../GraphQL/mutations/login";
import { toast } from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const [login, { data, error, loading }] = useMutation(LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters");
      return;
    }

    login({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  useEffect(() => {
    if (data) {
      const token = data.login.jwtToken;
      localStorage.setItem("ecoflipr-user-token", token);
      auth.login();
    }
  }, [data]);

  return (
    <div className="min-h-screen w-full flex">
      {/* left side */}
      <div className="relative hidden lg:block w-full">
        <img
          src={"../../images/signin_background.jpg"}
          alt="sign in background image"
          className="object-cover h-full"
        />
        {/* color on top of image layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-40"></div>
      </div>
      {/* right side with inputs */}
      <div className="relative bg-white flex flex-col justify-center py-[35px] px-[70px] items-center w-full lg:max-w-[600px]">
        <img
          src={"../../images/ecoflipr-logo-black.png"}
          alt="logo"
          className="h-10 absolute top-32 hover:scale-105 duration-100 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-2 lg:w-full">
          <p className="text-3xl font-normal">Login</p>
          <p className="mb-3">Please login to continue</p>
          <label htmlFor="email" className="text-[16px] font-light ml-[1px] text-gray-500">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm font-light"
          />
          <label htmlFor="password" className="text-[16px] font-light ml-[1px] text-gray-500">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm font-light"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <p className="font-medium text-sm">Remember for 30 days</p>
            </div>
            <div>
              <p className="float-right text-xs text-blue-700 font-medium cursor-pointer">Forgot your password?</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <div>
              <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-full">
                Sign in
              </button>
            </div>
            <div className="flex gap-2">
              <p>Don't have an account?</p>
              <p className="text-blue-700 cursor-pointer" onClick={() => navigate("/signup")}>
                Sign up
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

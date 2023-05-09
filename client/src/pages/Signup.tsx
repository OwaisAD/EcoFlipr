import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { CREATE_USER } from "../GraphQL/mutations/createUser";
import { toast } from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Signup = () => {
  const auth = useAuth();
  const [createUser, { data, error, loading }] = useMutation(CREATE_USER);
  const initialState = {
    first_name: "",
    last_name: "",
    address: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  };
  const [signUpCredentials, setSignUpCredentials] = useState(initialState);
  const [toc_confirmed, setToc_confirmed] = useState(false);
  const navigate = useNavigate();

  const handleSignUp: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    if (
      !signUpCredentials.first_name ||
      signUpCredentials.first_name.length < 2 ||
      signUpCredentials.first_name.length > 50
    ) {
      toast.error("First name must be between 2 and 50 characters");
      return;
    }
    if (
      !signUpCredentials.last_name ||
      signUpCredentials.last_name.length < 2 ||
      signUpCredentials.last_name.length > 50
    ) {
      toast.error("Last name must be between 2 and 50 characters");
      return;
    }
    if (!signUpCredentials.address || signUpCredentials.address.length < 5 || signUpCredentials.address.length > 100) {
      toast.error("Address must be between 5 and 100 characters");
      return;
    }

    if (!signUpCredentials.phone_number || !validator.isMobilePhone(signUpCredentials.phone_number, "da-DK")) {
      toast.error("Phone number must be a valid danish number");
      return;
    }

    if (!signUpCredentials.email || !validator.isEmail(signUpCredentials.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!signUpCredentials.password || signUpCredentials.password.length < 8) {
      toast.error("Password should be at least 8 characters");
      return;
    }

    if (signUpCredentials.password !== signUpCredentials.confirm_password) {
      toast.error("Passwords does not match");
      return;
    }

    if (!toc_confirmed) {
      toast.error("You must agree to the Terms and Conditions");
      return;
    }

    createUser({
      variables: {
        input: {
          first_name: signUpCredentials.first_name,
          last_name: signUpCredentials.last_name,
          email: signUpCredentials.email,
          password: signUpCredentials.password,
          phone_number: signUpCredentials.phone_number,
          address: signUpCredentials.address,
        },
      },
    });
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (data) {
      toast.success("Account created");
      setTimeout(() => {}, 2000);
      navigate("/login");
    }
  }, [data]);

  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    setSignUpCredentials({
      ...signUpCredentials,
      [target.id]: target.value,
    });
  };

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
      <div className="bg-white flex flex-col justify-center py-[35px] px-[70px] items-center w-full lg:max-w-[600px]">
        <div className="md:min-w-[450px] lg:max-w-[500px] ">
          <form onChange={onChange} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-normal">Create an account</p>
                <p className="mb-3">Please fill out the following fields</p>
              </div>
              <img src={"../../images/ecoflipr-logo-black.png"} alt="logo" className="h-8 hover:scale-105 duration-100 cursor-pointer mb-4" onClick={() => navigate("/")}/>
            </div>
            <label htmlFor="first_name" className="text-[16px] font-light ml-[1px] text-gray-500">
              First name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              id="first_name"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <label htmlFor="last_name" className="text-[16px] font-light ml-[1px] text-gray-500">
              Last name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              id="last_name"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <label htmlFor="address" className="text-[16px] font-light ml-[1px] text-gray-500">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter address"
              id="address"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <label htmlFor="phone_number" className="text-[16px] font-light ml-[1px] text-gray-500">
              Phone number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              id="phone_number"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <label htmlFor="email" className="text-[16px] font-light ml-[1px] text-gray-500">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter email"
              id="email"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <label htmlFor="password" className="text-[16px] font-light ml-[1px] text-gray-500">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm "
            />
            <label htmlFor="confirm_password" className="text-[16px] font-light ml-[1px] text-gray-500">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              id="confirm_password"
              className="border border-gray-300 rounded-[0.25rem] py-[12px] px-[20px] mb-[8px] text-sm"
            />

            <div className="flex items-center justify-center gap-2 my-3">
              <input
                type="checkbox"
                onChange={(e) => setToc_confirmed(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <p>
                I agree to these{" "}
                <span className="text-blue-700 dark:text-blue-500 hover:underline cursor-pointer">
                  Terms and Conditions
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 mt-2">
              <div>
                <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-full" onClick={handleSignUp}>
                  Sign up
                </button>
              </div>
              <div className="flex gap-2">
                <p>Already have an account?</p>
                <p className="text-blue-700 cursor-pointer" onClick={() => navigate("/login")}>
                  Sign in
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { CREATE_USER } from "../GraphQL/mutations/createUser";
import { toast } from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
      toast.error("First name must be between 2 and 50 characters", { position: "top-right" });
      return;
    }
    if (
      !signUpCredentials.last_name ||
      signUpCredentials.last_name.length < 2 ||
      signUpCredentials.last_name.length > 50
    ) {
      toast.error("Last name must be between 2 and 50 characters", { position: "top-right" });
      return;
    }
    if (!signUpCredentials.address || signUpCredentials.address.length < 5 || signUpCredentials.address.length > 100) {
      toast.error("Address must be between 5 and 100 characters", { position: "top-right" });
      return;
    }

    if (!signUpCredentials.phone_number || !validator.isMobilePhone(signUpCredentials.phone_number, "da-DK")) {
      toast.error("Phone number must be a valid danish number", { position: "top-right" });
      return;
    }

    if (!signUpCredentials.email || !validator.isEmail(signUpCredentials.email)) {
      toast.error("Please enter a valid email", { position: "top-right" });
      return;
    }

    if (!signUpCredentials.password || signUpCredentials.password.length < 8) {
      toast.error("Password should be at least 8 characters", { position: "top-right" });
      return;
    }

    if (signUpCredentials.password !== signUpCredentials.confirm_password) {
      toast.error("Passwords does not match", { position: "top-right" });
      return;
    }

    if (!toc_confirmed) {
      toast.error("You must agree to the Terms and Conditions", { position: "top-right" });
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
      <div className="relative hidden lg:block">
        <img
          src={"../../images/signin_background.jpg"}
          alt="sign in background image"
          className="object-cover h-full"
        />
        {/* color on top of image layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-40"></div>
      </div>
      {/* right side with inputs */}
      <div className="bg-white flex flex-col justify-center py-[35px] px-[70px] w-full md:max-w-full lg:max-w-[640px] items-center">
        <div className="min-w-[450px]">
          <form onChange={onChange} className="flex flex-col gap-2">
            <p className="text-3xl font-light">Create an account</p>
            <p>Please fill out the following fields</p>
            <label htmlFor="first_name">First name</label>
            <input type="text" placeholder="Enter first name" id="first_name" className="rounded-[0.2rem]" />

            <label htmlFor="last_name">Last name</label>
            <input type="text" placeholder="Enter last name" id="last_name" className="rounded-[0.2rem]" />

            <label htmlFor="address">Address</label>
            <input type="text" placeholder="Enter address" id="address" className="rounded-[0.2rem]" />

            <label htmlFor="phone_number">Phone number</label>
            <input type="text" placeholder="Enter phone number" id="phone_number" className="rounded-[0.2rem]" />

            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Enter email" id="email" className="rounded-[0.2rem]" />

            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Enter password" id="password" className="rounded-[0.2rem]" />
            <label htmlFor="confirm_password">Confirm password</label>
            <input type="password" placeholder="Confirm password" id="confirm_password" className="rounded-[0.2rem]" />

            <div className="flex items-center justify-center gap-2 my-3">
              <input type="checkbox" onChange={(e) => setToc_confirmed(e.target.checked)} />
              <p>
                I agree to these <span className="text-blue-700 cursor-pointer">Terms and Conditions</span>
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

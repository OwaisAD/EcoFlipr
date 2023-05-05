import { UserInputWithoutPass, UserInputWithPass } from "../types/user";
import validator from "validator";
import mongoose from "mongoose";
import { throwError } from "./errorHandler";

export const validateId = (id: any) => {
  return mongoose.Types.ObjectId.isValid(id);
};
export const validateUserInput = (userInput: UserInputWithPass | UserInputWithoutPass) => {
  const { email, first_name, last_name, phone_number, address } = userInput;

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!first_name || first_name.length < 2 || first_name.length > 50) {
    throw new Error("Please enter a valid firstname");
  }

  if (!last_name || last_name.length < 2 || last_name.length > 50) {
    throw new Error("Please enter a valid lastname");
  }
  if (!phone_number || !validator.isMobilePhone(phone_number, "da-DK")) {
    throw new Error("The entered phonenumber is not a valid Danish number");
  }

  if (!address || address.length < 5 || address.length > 100) {
    throw new Error("Please enter a valid address");
  }

  if ("password" in userInput && (!userInput.password || userInput.password.length < 8)) {
    throw new Error("Please enter a valid password");
  }
  return true;
};

export const validatePassword = (password: string) => {
  if (!password || password.length < 8) {
    throw new Error("Please enter a valid password");
  }
  return true;
};

export const validateLogin = (email: any, password: string) => {
  if (!email || !validator.isEmail(email)) {
    throwError("Invalid email");
  }

  validatePassword(password);

  return true;
};

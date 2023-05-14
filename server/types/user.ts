import mongoose from "mongoose";
import { SaleOffer } from "./saleoffer";

type User = {
  _id: mongoose.Types.ObjectId;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  passwordHash: string;
  sale_offers: SaleOffer[];
};

type UserInput = {
  input: {
    email: string;
    password: string;
  };
};

type UserInputWithPass = {
  input: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    password: string;

  }  
};

type UserInputWithoutPass = {
  input: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
  }  
};

type UserUpdatePassInput = {
  input: {
    id: mongoose.Types.ObjectId;
    newPassword: string;
  };
};

interface UserId {
  id: mongoose.Types.ObjectId | string
} 

export { User, UserInput, UserInputWithPass, UserInputWithoutPass, UserUpdatePassInput, UserId };

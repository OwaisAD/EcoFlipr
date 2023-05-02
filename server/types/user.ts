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

type UserInputWithPass = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  password: string;
};

type UserInputWithoutPass = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
};
export { User, UserInputWithPass, UserInputWithoutPass };

import mongoose from "mongoose";
import { User } from "./user";

export interface Context {
  currentUser: mongoose.AnyObject | null;
}

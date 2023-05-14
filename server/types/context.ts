import mongoose from "mongoose";

export interface Context {
  currentUser: mongoose.AnyObject | null;
}

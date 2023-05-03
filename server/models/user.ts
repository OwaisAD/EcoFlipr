import mongoose, { Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";
import { SaleOfferDocument } from "./saleoffer";

export interface UserDocument extends Document {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  passwordHash: string;
  sale_offers: SaleOfferDocument[]
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  first_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  phone_number: {
    type: String,
    required: true,
    validate: (v: any) => {
      return validator.isMobilePhone(v, "da-DK");
    },
    message: (props: any) => `${props.value} is not a valid Danish phone number!`,
  },
  address: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  passwordHash: {
    type: String,
    minLength: 8,
    required: true,
  },
  sale_offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "SaleOffer" }],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

export const User = mongoose.model<UserDocument>("User", userSchema);

export default User;

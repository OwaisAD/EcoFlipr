import { Document } from "mongoose";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
  },
  passwordHash: {
    type: String,
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

export const User = mongoose.model("User", userSchema);

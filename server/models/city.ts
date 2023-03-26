import { Document } from "mongoose";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

const citySchema = new mongoose.Schema({
  zip_code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

citySchema.plugin(uniqueValidator);

citySchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const City = mongoose.model("City", citySchema);

module.exports = City;
export {};

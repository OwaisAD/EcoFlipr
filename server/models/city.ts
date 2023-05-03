import { Document } from "mongoose";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";

const citySchema = new mongoose.Schema({
  zip_code: {
    type: String,
    required: true,
    unique: true,
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
  },
});

const City = mongoose.model("City", citySchema);

export default City;

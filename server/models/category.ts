import { Document } from "mongoose";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

categorySchema.plugin(uniqueValidator);

categorySchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;

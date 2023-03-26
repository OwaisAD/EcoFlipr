import { Document } from "mongoose";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 500,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.plugin(uniqueValidator);

commentSchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
export {};

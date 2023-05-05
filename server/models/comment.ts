import { Document } from "mongoose";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";

export interface CommentDocument extends Document {
  thread_id: mongoose.Schema.Types.ObjectId;
  author_id: mongoose.Schema.Types.ObjectId;
  content: string;
  is_read: boolean;
  created_at: Date;
}

const commentSchema = new mongoose.Schema<CommentDocument>({
  thread_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
  },
});

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;

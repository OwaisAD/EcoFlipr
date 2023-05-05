import { Document } from "mongoose";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";
import { CommentDocument } from "./comment";

export interface ThreadDocument extends Document {
  sale_offer_id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  comments: CommentDocument[];
}

const threadSchema = new mongoose.Schema<ThreadDocument>({
  sale_offer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaleOffer",
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

threadSchema.plugin(uniqueValidator);

threadSchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Thread = mongoose.model<ThreadDocument>("Thread", threadSchema);

export default Thread;

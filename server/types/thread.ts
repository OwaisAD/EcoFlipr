import { Types, Document } from "mongoose";

export interface IThread extends Document {
  _id: Types.ObjectId;
  creator_id: Types.ObjectId;
  comments: Types.ObjectId[];
}
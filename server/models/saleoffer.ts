import { CallbackError, Date, Document } from "mongoose";
import type { SaleOffer } from "../types/saleoffer";
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { ThreadDocument } from "./thread";

export interface SaleOfferDocument extends Document {
  creator_id: mongoose.Types.ObjectId;
  description: string;
  category: mongoose.Types.ObjectId;
  is_shippable: boolean;
  city: mongoose.Types.ObjectId;
  price: number;
  imgs: string[];
  threads: ThreadDocument[];
  created_at: Date;
  updated_at: Date;
  notification_count: number;
}

const saleOfferSchema = new mongoose.Schema<SaleOfferDocument>({
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 300,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  is_shippable: {
    type: Boolean,
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 99999999,
  },
  imgs: [{ type: String }],
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

saleOfferSchema.plugin(uniqueValidator);

saleOfferSchema.pre("save", function (this: SaleOffer, next: (err?: CallbackError | undefined) => void) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

saleOfferSchema.set("toJSON", {
  transform: (_document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const SaleOffer = mongoose.model<SaleOfferDocument>("SaleOffer", saleOfferSchema);

export default SaleOffer;

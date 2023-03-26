import { NextFunction } from "express";
import { Document } from "mongoose";
import type { SaleOffer } from "../types/saleoffer";

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const saleOfferSchema = new mongoose.Schema({
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

saleOfferSchema.pre("save", function (this: SaleOffer, next: NextFunction) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

saleOfferSchema.set("toJSON", {
  transform: (document: Document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const SaleOffer = mongoose.model("SaleOffer", saleOfferSchema);

module.exports = SaleOffer;
export {};

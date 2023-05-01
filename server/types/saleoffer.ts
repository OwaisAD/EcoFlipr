import mongoose from "mongoose";

type SaleOffer = {
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  is_shippable: boolean;
  city: mongoose.Schema.Types.ObjectId;
  price: number;
  imgs: string[];
  threads: mongoose.Schema.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
};

export type { SaleOffer };

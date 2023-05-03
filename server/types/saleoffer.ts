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
type SaleOfferInput = {
  input: {
    description: string;
    category: { id: string };
    is_shippable: boolean;
    city: { id: string };
    price: number;
    imgs: string[];
  };
};

type SaleOfferById = {
  id: string;
};

type SaleOfferUpdateInput = {
  id: string;
  input: {
    description: string;
    category: { id: string };
    is_shippable: boolean;
    city: { id: string };
    price: number;
    imgs: string[];
  };
};

export type { SaleOffer, SaleOfferInput, SaleOfferById, SaleOfferUpdateInput };

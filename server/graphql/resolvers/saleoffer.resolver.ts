import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import { SaleOfferById, SaleOfferInput, SaleOfferUpdateInput } from "../../types/saleoffer";
import { SaleOfferDocument } from "../../models/saleoffer";
import { validateId } from "../../utils/validator";
import User from "../../models/user";
import mongoose from "mongoose";
import Thread from "../../models/thread";
import Comment from "../../models/comment";
import Category from "../../models/category";
import City from "../../models/city";

export const saleOfferResolver = {
  Query: {
    getSaleOfferById: async (_parent: never, { id }: SaleOfferById, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const isValidSaleOfferId = validateId(id);

      if (!isValidSaleOfferId) {
        throw new GraphQLError("Invalid sale offer id", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // remember to populate threads and comments
      const saleOffer = await SaleOffer.findById(id)
        .populate("category")
        .populate("city")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      if (saleOffer === null) {
        throw new Error("Sale offer does not exist");
      }

      // check who is making the call and calculate notifications

      // if saleoffer.creator_id === currentUser.id
          // check if there's any comments where author_id !== currentUser._id && is_read === false
            // if true:
              // add to count variable

      // else not the author of the saleoffer
        // check if there's any comments where author._id === saleoffer.creator._id && is_read === false
          // if true
            // add to count variable


      return saleOffer;
    },
    getSaleOffersByUser: async (_parent: never, _args: never, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return await SaleOffer.find({ creator_id: currentUser._id })
        .populate("city")
        .populate("category")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });
    },
    getSaleOffersByUserInteraction: async () => {},
    getSaleOfferBySearchQuery: async () => {},
    getRecentSaleOffersByAmount: async () => {},
    getRandomSaleOffersByAmount: async () => {},
  },
  Mutation: {
    createSaleOffer: async (_parent: never, args: SaleOfferInput, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      let { description, category, is_shippable, city, price, imgs } = args.input;

      console.log({ description, category, is_shippable, city, price, imgs });

      const newSaleOffer = await SaleOffer.create({
        creator_id: currentUser._id,
        description,
        category: category.id,
        is_shippable,
        city: city.id,
        price,
        imgs,
      });
      currentUser.sale_offers.push(newSaleOffer);
      await currentUser.save();
      const getSaleOffer = await SaleOffer.findById(newSaleOffer._id).populate([
        { path: "city", model: City },
        { path: "category", model: Category },
        { path: "threads", model: Thread, populate: { path: "comments", model: Comment } },
      ]);
      return getSaleOffer;
    },
    updateSaleOffer: async (
      _parent: never,
      { id, input }: SaleOfferUpdateInput,
      { currentUser }: Context,
      _info: any
    ) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const isValidSaleOfferId = validateId(id);

      if (!isValidSaleOfferId) {
        throw new GraphQLError("Invalid sale offer id", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const updatedSaleOffer = {
        description: input.description,
        category: input.category.id,
        is_shippable: input.is_shippable,
        city: input.city.id,
        price: input.price,
        imgs: [...input.imgs],
      };

      const updated = await SaleOffer.findByIdAndUpdate(id, updatedSaleOffer, { new: true })
        .populate("category")
        .populate("city")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      return updated;
    },
    deleteSaleOfferById: async () => {},
  },
};

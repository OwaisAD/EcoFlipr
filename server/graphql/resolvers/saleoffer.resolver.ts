import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import { SaleOfferById, SaleOfferInput, SaleOfferUpdateInput } from "../../types/saleoffer";
import { SaleOfferDocument } from "../../models/saleoffer";
import { validateId } from "../../utils/validator";
import User from "../../models/user";
import mongoose, { Types } from "mongoose";
import Thread from "../../models/thread";
import Comment from "../../models/comment";
import Category from "../../models/category";
import City from "../../models/city";
import { infoLog } from "../../utils/logger";

interface ThreadComment {
  _id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  content: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

interface Thread {
  _id: mongoose.Types.ObjectId;
  sale_offer_id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  comments: ThreadComment[];
  __v: number;
}

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

      // else return only info about the sale offer - no threads included
      if (!saleOffer.threads) {
        return saleOffer;
      }

      // if it is the owner of the sale offer - return everything about the sale offer
      if (saleOffer.creator_id === currentUser._id) {
        infoLog("Owner of SaleOffer");
        return saleOffer;
      }

      // if it is someone who is asking about the sale offer - return only the one thread regarding the person
      const filterUserThread = saleOffer.threads.filter(
        (thread) =>
          //@ts-ignore
          thread.creator_id.toString() === currentUser._id.toString()
      );

      if (filterUserThread.length > 0) {
        console.log("THERE IS A THREAD");
        const id = filterUserThread[0]!._id;
        const objectId = new Types.ObjectId(id.toString());
        return await SaleOffer.findOne({ _id: saleOffer._id, threads: objectId })
          .populate("category")
          .populate("city")
          .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });
      } else {
        console.log("NO THREAD FOUND");
        return await SaleOffer.findOne({ _id: saleOffer._id }, { threads: false })
          .populate("category")
          .populate("city")
          .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });
      }
    },
    getSaleOffersByUser: async (_parent: never, _args: never, { currentUser }: Context, _info: any) => {
      // get all the sale offers for the user making the call
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const saleOffers = await SaleOffer.find({ creator_id: currentUser._id })
        .populate("city")
        .populate("category")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      saleOffers.forEach((saleOffer) => {
        let notificationCount = 0;
        saleOffer.threads.forEach((thread) => {
          if (thread) {
            //@ts-ignore
            thread.comments.forEach((comment) => {
              if (!comment.is_read) {
                notificationCount++;
              }
            });
          }
        });
        //@ts-ignore
        saleOffer.notification_count = notificationCount;
      });
      
      return saleOffers;
    },
    getSaleOffersByUserInteraction: async (_parent: never, _args: never, { currentUser }: Context, _info: any) => {
      // get the sale offers that the user has interacted with, meaning the ones they don't own but they have commented on
      // find a way to add notification count for each of the saleoffers -  remember to add to the return type graphql
      // // check who is making the call and calculate notifications
      // // if saleoffer.creator_id === currentUser.id
      // //@ts-ignore
      // console.log(saleOffer.threads[0].comments.forEach((comment) => console.log(comment)));
      // if (saleOffer.creator_id === currentUser._id) {
      //   const unreadCommentsCount =
      //   // check if there's any comments where author_id !== currentUser._id && is_read === false
      //   // console.log(saleOffer.threads.comments)
      // }
      // // if true:
      // // add to count variable
      // // else not the author of the saleoffer
      // // check if there's any comments where author._id === saleoffer.creator._id && is_read === false
      // // if true
      // // add to count variable
    },
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

import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import {
  SaleOfferById,
  SaleOfferInput,
  SaleOfferUpdateInput,
  SaleOfferSearch,
  SaleOffersAmountInput,
} from "../../types/saleoffer";
import { validateId } from "../../utils/validator";
import User from "../../models/user";
import mongoose, { Types } from "mongoose";
import Thread from "../../models/thread";
import Comment from "../../models/comment";
import Category from "../../models/category";
import City from "../../models/city";
import { throwError } from "../../utils/errorHandler";
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
      if (saleOffer.creator_id.toString() === currentUser._id.toString()) {
        infoLog("Owner of SaleOffer");
        return saleOffer;
      }

      // if it is someone who is asking about the sale offer - return only the one thread regarding the person
      const filterUserThread = saleOffer.threads.filter((thread) => {
        //@ts-ignore
        return thread.creator_id.toString() === currentUser._id.toString();
      });

      if (filterUserThread.length > 0) {
        console.log("THERE IS A THREAD");
        const id = filterUserThread[0]!._id;

        console.log("THREAD ID", id);
        const saleOfferFromDb = await SaleOffer.findOne({ _id: saleOffer._id }, { threads: false })
          .populate("category")
          .populate("city")
          .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

        const threadFromDb = await Thread.findById(id).populate("comments");

        if (!saleOfferFromDb || !threadFromDb) {
          throwError("Something went wrong. Please try again.");
        }

        return {
          id: saleOfferFromDb!._id,
          creator_id: saleOfferFromDb!.creator_id,
          description: saleOfferFromDb!.description,
          category: saleOfferFromDb?.category,
          is_shippable: saleOfferFromDb!.is_shippable,
          city: saleOfferFromDb!.city,
          price: saleOfferFromDb!.price,
          imgs: saleOfferFromDb!.imgs,
          threads: Array.isArray(threadFromDb) ? [...threadFromDb] : [threadFromDb],
          created_at: saleOfferFromDb?.created_at,
          updated_at: saleOfferFromDb?.updated_at,
        };
      } else {
        console.log("NO THREAD FOUND");
        return await SaleOffer.findOne({ _id: saleOffer._id }, { threads: false })
          .populate("category")
          .populate("city")
          .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });
      }
    },
    getSaleOffersByUser: async (_parent: never, _args: never, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // get all the sale offers for the user making the call
      const saleOffers = await SaleOffer.find({ creator_id: currentUser._id })
        .populate("city")
        .populate("category")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      // calculate notifications
      saleOffers.forEach((saleOffer) => {
        let notificationCount = 0;
        saleOffer.threads.forEach((thread) => {
          //@ts-ignore
          thread.comments.forEach((comment) => {
            if (!comment.is_read && comment.author_id.toString() !== currentUser._id.toString()) {
              notificationCount++;
            }
          });
        });
        //@ts-ignore
        saleOffer.notification_count = notificationCount;
      });

      return saleOffers;
    },
    getSaleOffersByUserInteraction: async (_parent: never, _args: never, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      // get the sale offers that the user has interacted with, meaning the ones they don't own but they have commented on
      const threads = await Thread.find({ creator_id: currentUser._id });

      if (!threads) {
        throwError("You haven't interacted on any sale offers");
      }
      let threadIds = threads.map((thread) => new mongoose.Types.ObjectId(thread.sale_offer_id));

      console.log(threadIds);

      const saleOffers = await SaleOffer.find({ _id: { $in: threadIds } })
        .populate("category")
        .populate("city")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      // calculate notifications
      saleOffers.forEach((saleOffer) => {
        let notificationCount = 0;
        saleOffer.threads.forEach((thread) => {
          //@ts-ignore
          if (thread && thread.creator_id.toString() === currentUser._id.toString()) {
            //@ts-ignore
            thread.comments.forEach((comment) => {
              if (!comment.is_read && comment.author_id.toString() !== currentUser._id.toString()) {
                notificationCount++;
              }
            });
          }
        });
        //@ts-ignore
        saleOffer.notification_count = notificationCount;
      });

      // filter threads that are mine
      saleOffers.forEach((saleOffer) => {
        saleOffer.threads = saleOffer.threads.filter((thread) => {
          //@ts-ignore
          thread.creator_id.toString() === currentUser._id;
        });
      });

      return saleOffers;
    },
    getSaleOfferBySearchQuery: async (_parent: never, args: SaleOfferSearch) => {
      const ITEMS_PER_PAGE = 20;

      let searchWords = args.searchQuery;
      if (!searchWords) {
        throwError("Please enter a valid search query");
      }
      searchWords = searchWords.trim();

      if (!searchWords || searchWords.length > 100) {
        let errorMsg = !searchWords
          ? `Please enter a valid search query`
          : `Could not find any results for: ${searchWords.substring(0, 20)}...`;
        throwError(errorMsg);
      }

      let page = args.page || 1;
      if (page < 1) {
        page = 1;
      }

      const searchTerms = searchWords.split(" ");
      const regex = new RegExp(searchTerms.join("|"), "i");

      const skip = (page - 1) * ITEMS_PER_PAGE;
      const countPromise = SaleOffer.find({ description: regex });

      const saleOffersPromise = SaleOffer.find({ description: regex }, { threads: false })
        .populate([
          { path: "city", model: City },
          { path: "category", model: Category },
          { path: "threads", model: Thread, populate: { path: "comments", model: Comment } },
        ])
        .skip(skip)
        .limit(ITEMS_PER_PAGE);

      const [count, saleOffers] = await Promise.all([countPromise, saleOffersPromise]);

      if (saleOffers.length < 1) {
        throwError(`Found no results for: ${searchWords} on page ${page}`);
      }

      // for instance, if we have 400 items and 20 items per page, then we can calculate the amount of pages

      const pageCount = Math.ceil(count.length / ITEMS_PER_PAGE);

      return { pagination: { count: count.length, pageCount: pageCount }, saleOffers };
    },
    getRecentSaleOffersByAmount: async (_parent: never, { amount }: SaleOffersAmountInput) => {
      if (amount < 1) {
        amount = 1;
      } else if (amount > 10) {
        amount = 10;
      }

      return await SaleOffer.find()
        .sort({ _id: -1 })
        .limit(amount)
        .populate([
          { path: "city", model: City },
          { path: "category", model: Category },
        ]);
    },
    getRandomSaleOffersByAmount: async (_parent: never, { amount }: SaleOffersAmountInput) => {
      if (amount < 1) {
        amount = 1;
      } else if (amount > 10) {
        amount = 10;
      }

      const randomSaleOffers = await SaleOffer.aggregate([{ $sample: { size: amount } }]);

      const randomSaleOffersIds = randomSaleOffers.map((so) => so._id);

      return await SaleOffer.find({ _id: { $in: randomSaleOffersIds } }).populate([
        { path: "city", model: City },
        { path: "category", model: Category },
      ]);
    },
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
    deleteSaleOfferById: async (_parent: never, { id }: SaleOfferById, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const isValidSaleOfferId = validateId(id);

      if (!isValidSaleOfferId) {
        throwError("Invalid id");
      }

      const saleOffer = await SaleOffer.findById(id)
        .populate("city")
        .populate("category")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      if (!saleOffer) {
        throwError(`No such sale offer with id: ${id}`);
      }

      if (saleOffer!.creator_id.toString() !== currentUser._id.toString()) {
        throwError(`Not authorized`);
      }

      // delete comments
      const commentIds = saleOffer?.threads
        .map((threads) => {
          //@ts-ignore
          return threads.comments.map((comment) => comment._id);
        })
        .flat();

      await Comment.deleteMany({ _id: { $in: commentIds } });

      // then threads
      const threadIds = saleOffer?.threads.map((thread) => thread._id);
      await Thread.deleteMany({ _id: { $in: threadIds } });

      await saleOffer?.delete();
      return { id };
    },
  },
};

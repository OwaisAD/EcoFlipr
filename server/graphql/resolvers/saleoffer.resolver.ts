import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import { SaleOfferById, SaleOfferInput, SaleOfferUpdateInput, SaleOfferSearch } from "../../types/saleoffer";
import { validateId } from "../../utils/validator";
import Thread from "../../models/thread";
import Comment from "../../models/comment";
import Category from "../../models/category";
import City from "../../models/city";
import { throwError } from "../../utils/errorHandler";

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
    getSaleOfferBySearchQuery: async (_parent: never, args: SaleOfferSearch, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let searchWords = args.searchQuery;

      if (!searchWords || searchWords.length > 100) {
        let errorMsg = !searchWords
          ? `Please enter a valid search query`
          : `Could not find any results for: ${searchWords.substring(0, 20)}...`;
        throwError(errorMsg);
      }

      searchWords = searchWords.trim();

      const searchTerms = searchWords.split(" ");
      const regex = new RegExp(searchTerms.join("|"), "i");

      const saleOffers = await SaleOffer.find({ description: regex }, { threads: false }).populate([
        { path: "city", model: City },
        { path: "category", model: Category },
        { path: "threads", model: Thread, populate: { path: "comments", model: Comment } },
      ]);

      return saleOffers;
    },
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

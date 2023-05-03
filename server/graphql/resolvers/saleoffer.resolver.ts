import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import { SaleOfferById, SaleOfferInput } from "../../types/saleoffer";
import { SaleOfferDocument } from "../../models/saleoffer";
import { validateId } from "../../utils/validator";

export const saleOfferResolver = {
  Query: {
    getSaleOfferById: async (_parent: never, {id}: SaleOfferById, {currentUser}: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const isValidSaleOfferId = validateId(id)

      if(!isValidSaleOfferId) {
        throw new GraphQLError("Invalid sale offer id", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      
        // remember to populate threads and comments
        const saleOffer = await SaleOffer.findById(id).populate("category").populate("city");
        
        if(saleOffer === null){
          throw new Error("Sale offer does not exist")
        }
        return saleOffer;
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
      const newSaleOffer = await SaleOffer.create({
        description,
        category: category.id,
        is_shippable,
        city: city.id,
        price,
        imgs,
      });
      currentUser.sale_offers.push(newSaleOffer);
      await currentUser.save();
      return newSaleOffer;
    },
    updateSaleOffer: async () => {},
    deleteSaleOfferById: async () => {},
  },
};

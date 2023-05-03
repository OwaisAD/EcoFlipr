import { GraphQLError } from "graphql";
import SaleOffer from "../../models/saleoffer";
import { Context } from "../../types/context";
import { SaleOfferInput } from "../../types/saleoffer";


export const saleOfferResolver = {
  Query: {
    getSaleOfferById: async (_parent: any, args: any, _context: any, _info: any) => {
      const id = args.id;
      try {
        const saleoffer = await SaleOffer.findById(id);
        return saleoffer;
      } catch (error: any) {
        return `Something went wrong, ${error.message}`;
      }
    },
    getSaleOfferBySearchQuery: async () => {},
    getRecentSaleOffersByAmount: async () => {},
    getRandomSaleOffersByAmount: async () => {},
  },
  Mutation: {
    createSaleOffer: async (_parent: never, args: SaleOfferInput, {currentUser}: any, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      let {description, category, is_shippable,city, price, imgs}=args.input
      console.log(description, category, is_shippable,city, price, imgs);
      const newSaleOffer = await SaleOffer.create({
        description,
        category: category.id,
        is_shippable,
        city:city.id,
        price,
        imgs,
      }) 
      currentUser.sale_offers.push(newSaleOffer)
      currentUser.save()
      return newSaleOffer
    },
    updateSaleOffer: async () => {},
    deleteSaleOfferById: async () => {},
  },
};

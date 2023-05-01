import SaleOffer from "../../models/saleoffer";

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
    createSaleOffer: async () => {},
    updateSaleOffer: async () => {},
    deleteSaleOfferById: async () => {},
  },
};

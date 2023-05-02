import Category from "../../models/category";

export const categoryResolver = {
  Query: {
    getAllCategories: async (_parent: any, args: any, context: any, _info: any) => {
      const categories = await Category.find({});
      return categories;
    },
  },
};

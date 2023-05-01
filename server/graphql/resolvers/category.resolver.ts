import Category from "../../models/category";

export const categoryResolver = {
  Query: {
    getAllCategories: async () => {
      const categories = await Category.find({});
      return categories;
    },
  },
};

import Category from "../../models/category";

export const categoryResolver = {
  Query: {
    hello: () => {
      return "Hello World Hehe!";
    },
    getAllCategories: async () => {
      const categories = await Category.find({});
      return categories;
    },
  },
};

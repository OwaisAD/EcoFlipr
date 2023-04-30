import Category from "../../models/category";

export const categoryResolver = {
  Query: {
    getAllCategories: async () => {
      const categories = await Category.find({});
      return categories;
    },
    getCategoryById: async (_parent: any, args: any, _context: any, _info: any) => {
      const id = args.id;
      try {
        const category = await Category.findById(id);
        return category;
      } catch (error: any) {
        return `Something went wrong, ${error.message}`;
      }
    },
  },
};

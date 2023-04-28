import Category from "../models/category";

const resolvers = {
  Query: {
    hello: () => {
      return "Hello World!";
    },
    getAllCategories: async () => {
      const categories = await Category.find({});
      return categories;
    },
  },
  Mutation: {
    createPost: async (parent: any, args: any, context: any, info: any) => {
      console.log("CREATING POST");
    },
  },
};

export default resolvers;

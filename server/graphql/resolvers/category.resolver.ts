import { GraphQLError } from "graphql";
import Category from "../../models/category";
import { Context } from "../../types/context";

export const categoryResolver = {
  Query: {
    getAllCategories: async (_parent: never, _args: never, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const categories = await Category.find({});
      return categories;
    },
  },
};

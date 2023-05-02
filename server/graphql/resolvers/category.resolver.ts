import { GraphQLError } from "graphql";
import Category from "../../models/category";
import { User } from "../../types/user";
import { Context } from "../../types/context";

export const categoryResolver = {
  Query: {
    getAllCategories: async (_parent: any, args: any, { currentUser }: Context, _info: any) => {
      console.log(currentUser);
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

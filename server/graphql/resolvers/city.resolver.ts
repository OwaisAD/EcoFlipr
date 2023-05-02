import { GraphQLError } from "graphql";
import City from "../../models/city";
import { Context } from "../../types/context";

export const cityResolver = {
  Query: {
    getCityByZipCode: async (_parent: any, args: any, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const zip_code = args.zip_code;

      try {
        const city = await City.findOne({ zip_code: zip_code });

        if (city == null) {
          throw new Error("City was not found");
        }

        return city;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};

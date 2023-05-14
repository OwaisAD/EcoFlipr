import { GraphQLError } from "graphql";
import City from "../../models/city";
import { Context } from "../../types/context";
import { CityInput } from "../../types/city";

export const cityResolver = {
  Query: {
    getCityByZipCode: async (_parent: never, args: CityInput, { currentUser }: Context) => {
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
      } catch (error: unknown) {
        throw new Error("Something went wrong");
      }
    },
  },
};

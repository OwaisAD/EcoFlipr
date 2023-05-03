import { GraphQLError } from "graphql";

export const throwError = (message: string, code: string = "BAD_USER_INPUT") => {
  throw new GraphQLError(message, {
    extensions: {
      code,
    },
  });
};

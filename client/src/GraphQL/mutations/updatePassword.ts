import { gql } from "@apollo/client";

export const UPDATE_PASSWORD = gql`
  mutation Mutation($input: UpdateUserPasswordInput) {
    updateUserPassword(input: $input)
  }
`;

import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation Mutation($input: UpdateUserInput) {
    updateUser(input: $input) {
      id
      email
      first_name
      last_name
      phone_number
      address
    }
  }
`;

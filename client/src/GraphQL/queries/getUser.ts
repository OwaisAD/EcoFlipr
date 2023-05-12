import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
      first_name
      last_name
      phone_number
      address
    }
  }
`;

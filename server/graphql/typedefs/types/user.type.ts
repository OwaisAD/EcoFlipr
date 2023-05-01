import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    email: String
    first_name: String
    last_name: String
    phone_number: String
    address: String
    sale_offers: [SaleOffer]
  }

  input UserInput {
    email: String
    first_name: String
    last_name: String
    phone_number: String
    address: String
    password: String
  }

  input UpdateUserInput {
    id: ID!
    email: String
    first_name: String
    last_name: String
    phone_number: String
    address: String
  }

  input UserLoginInput {
    email: String
    password: String
  }

  type DeletedUser {
    id: ID!
  }
`;

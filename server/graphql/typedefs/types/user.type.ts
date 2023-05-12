import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    email: String!
    first_name: String!
    last_name: String!
    phone_number: String!
    address: String!
    sale_offers: [SaleOffer]
  }

  type UserWithoutSaleoffers {
    id: ID!
    email: String!
    first_name: String!
    last_name: String!
    phone_number: String!
    address: String!
  }

  type ValidatedUser {
    jwtToken: String
  }

  input UserInput {
    email: String!
    first_name: String!
    last_name: String!
    phone_number: String!
    address: String!
    password: String!
  }

  input UpdateUserInput {
    email: String
    first_name: String
    last_name: String
    phone_number: String
    address: String
  }

  input UpdateUserPasswordInput {
    newPassword: String
  }

  input UserLoginInput {
    email: String
    password: String
  }

  type DeletedUser {
    id: ID!
  }

  type UserData {
    id: ID!
    first_name: String!
    last_name: String!
    phone_number: String!
  }
`;

import { gql } from "apollo-server-express";

export default gql`
  type City {
    id: ID!
    zip_code: String!
    name: String!
  }

  input CityInput {
    id: ID!
  }
`;

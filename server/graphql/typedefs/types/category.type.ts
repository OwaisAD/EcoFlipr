import { gql } from "apollo-server-express";

export default gql`
  type Category {
    id: ID!
    name: String
  }
`;

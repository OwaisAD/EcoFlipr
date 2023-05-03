import { gql } from "apollo-server-express";

export default gql`
  type Thread {
    id: ID!
    sale_offer_id: ID
    creator_id: ID!
    comments: [Comment!]!
  }
`;

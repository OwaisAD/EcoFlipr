import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  type Comment {
    id: ID!
    thread_id: ID!
    author_id: ID!
    content: String!
    is_read: Boolean
    created_at: Date
  }

  input CommentInput {
    threadId: ID
    saleOfferId: ID!
    content: String!
  }
`;

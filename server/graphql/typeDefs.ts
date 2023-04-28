import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Post {
    id: ID!
    title: String
    description: String
  }

  type Category {
    id: ID!
    name: String
  }

  type Query {
    hello: String
    getAllPosts: [Post]
    getPostById(id: ID): Post
    getAllCategories: [Category]
  }

  input PostInput {
    title: String
    description: String
  }

  type Mutation {
    createPost(post: PostInput): Post
  }
`;

export default typeDefs;

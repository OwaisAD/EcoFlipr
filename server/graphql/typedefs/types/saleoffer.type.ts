import { gql } from "apollo-server-express";
import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

export default gql`
  scalar Date

  type SaleOffer {
    id: ID!
    creator_id: ID
    description: String!
    category: Category!
    is_shippable: Boolean!
    city: City!
    price: Int!
    imgs: [String]
    threads: [Thread]
    created_at: Date
    updated_at: Date
  }

  type SaleOfferSearchResult {
    id: ID!
    creator_id: ID
    description: String!
    category: Category!
    is_shippable: Boolean!
    city: City!
    price: Int!
    imgs: [String]
    created_at: Date
    updated_at: Date
  }

  input SaleOfferInput {
    description: String!
    category: CategoryInput!
    is_shippable: Boolean!
    city: CityInput!
    price: Int!
    imgs: [String]
  }

  input SaleOfferUpdateInput {
    description: String!
    category: CategoryInput!
    is_shippable: Boolean!
    city: CityInput!
    price: Int!
    imgs: [String]
  }

  type DeletedSaleOffer {
    id: ID!
  }
`;

import { gql } from "apollo-server-express";

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

  type paginationData {
    count: Int
    pageCount: Float
  }

  type SearchResult {
    pagination: paginationData
    saleOffers: [SaleOfferSearchResult]
  }

  type SaleOfferWithNotificationCount {
    id: ID!
    notification_count: Int
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

  type SaleOfferBasic {
    id: ID!
    description: String!
    category: Category!
    is_shippable: Boolean!
    city: City!
    price: Int!
    imgs: [String]
  }
`;

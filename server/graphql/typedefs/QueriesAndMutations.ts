import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getAllCategories: [Category]

    getSaleOfferById(id: ID!): SaleOffer
    getSaleOfferBySearchQuery(searchQuery: String): [SaleOffer]
    getRecentSaleOffersByAmount(amount: Int): [SaleOffer]
    getRandomSaleOffersByAmount(amount: Int): [SaleOffer]

    getUserNotifications(userId: ID!): Int

    getUserById(id: ID!): User

    getCityByZipCode(zip_code: String): City
  }
  type Mutation {
    login(input: UserLoginInput): User
    createUser(input: UserInput): User
    updateUserById(input: UpdateUserInput): User
    deleteUserById(id: ID!): DeletedUser
    updateUserPasswordById(input: UpdateUserPasswordInput): User

    createSaleOffer(input: SaleOfferInput): SaleOffer
    updateSaleOffer(input: SaleOfferInput): SaleOffer
    deleteSaleOfferById(id: ID!): DeletedSaleOffer

    createComment(input: CommentInput): Comment
  }
`;

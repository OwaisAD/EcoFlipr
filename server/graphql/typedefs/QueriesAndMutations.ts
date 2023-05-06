import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getAllCategories: [Category]

    getSaleOfferById(id: ID!): SaleOffer
    getSaleOffersByUser: [SaleOfferWithNotificationCount]
    getSaleOffersByUserInteraction: [SaleOffer]
    getSaleOfferBySearchQuery(searchQuery: String): [SaleOfferSearchResult]
    getRecentSaleOffersByAmount(amount: Int): [SaleOfferBasic]
    getRandomSaleOffersByAmount(amount: Int): [SaleOfferBasic]

    getUserNotifications(userId: ID!): Int

    getUserById(id: ID!): User

    getCityByZipCode(zip_code: String): City
  }
  type Mutation {
    login(input: UserLoginInput): ValidatedUser
    createUser(input: UserInput): User
    updateUserById(input: UpdateUserInput): User
    deleteUser: DeletedUser
    updateUserPasswordById(input: UpdateUserPasswordInput): String

    createSaleOffer(input: SaleOfferInput): SaleOffer
    updateSaleOffer(input: SaleOfferUpdateInput, id: ID!): SaleOffer
    deleteSaleOfferById(id: ID!): DeletedSaleOffer

    createComment(input: CommentInput): Comment

    markThreadAsRead(threadId: String): String
  }
`;

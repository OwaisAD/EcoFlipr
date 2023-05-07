import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getAllCategories: [Category]

    getSaleOfferById(id: ID!): SaleOffer
    getSaleOffersByUser: [SaleOfferWithNotificationCount]
    getSaleOffersByUserInteraction: [SaleOffer]
    getSaleOfferBySearchQuery(searchQuery: String, page: Int): SearchResult
    getRecentSaleOffersByAmount(amount: Int): [SaleOfferBasic]
    getRandomSaleOffersByAmount(amount: Int): [SaleOfferBasic]

    getUser: UserWithoutSaleoffers

    getCityByZipCode(zip_code: String): City
  }
  type Mutation {
    login(input: UserLoginInput): ValidatedUser
    createUser(input: UserInput): User
    updateUser(input: UpdateUserInput): UserWithoutSaleoffers
    deleteUser: DeletedUser 
    updateUserPassword(input: UpdateUserPasswordInput): String

    createSaleOffer(input: SaleOfferInput): SaleOffer
    updateSaleOffer(input: SaleOfferUpdateInput, id: ID!): SaleOffer
    deleteSaleOfferById(id: ID!): DeletedSaleOffer

    createComment(input: CommentInput): Comment

    markThreadAsRead(threadId: String): String
  }
`;

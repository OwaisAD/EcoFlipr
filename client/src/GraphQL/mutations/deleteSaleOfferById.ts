import { gql } from "@apollo/client";

export const DELETE_SALE_OFFER_BY_ID = gql`
mutation DeleteSaleOfferById($deleteSaleOfferById: ID!) {
    deleteSaleOfferById(id: $deleteSaleOfferById) {
      id
    }
  }
`
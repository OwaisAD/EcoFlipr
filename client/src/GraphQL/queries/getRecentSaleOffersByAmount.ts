import { gql } from "@apollo/client";

export const GET_RECENT_SALE_OFFERS_BY_AMOUNT = gql`
  query GetRecentSaleOffersByAmount($amount: Int) {
    getRecentSaleOffersByAmount(amount: $amount) {
      id
      description
      category {
        id
        name
      }
      is_shippable
      city {
        id
        zip_code
        name
      }
      price
      imgs
    }
  }
`;

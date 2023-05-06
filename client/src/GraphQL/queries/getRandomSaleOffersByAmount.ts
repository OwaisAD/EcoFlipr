import { gql } from "@apollo/client";

export const GET_RANDOM_SALE_OFFERS_BY_AMOUNT = gql`
  query GetRandomSaleOffersByAmount($amount: Int) {
    getRandomSaleOffersByAmount(amount: $amount) {
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

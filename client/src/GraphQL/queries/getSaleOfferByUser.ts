import { gql } from "@apollo/client";

export const GET_SALE_OFFERS_BY_USER = gql`
  query GetSaleOffersByUser {
    getSaleOffersByUser {
      id
      notification_count
      description
      is_shippable
      price
      imgs
      created_at
      updated_at
      category {
        name
      }
      city {
        name
        zip_code
      }
    }
  }
`;

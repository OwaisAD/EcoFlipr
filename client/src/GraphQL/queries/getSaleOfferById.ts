import { gql } from "@apollo/client";

export const GET_SALE_OFFER_BY_ID = gql`
  query GetSaleOfferById($getSaleOfferByIdId: ID!) {
    getSaleOfferById(id: $getSaleOfferByIdId) {
      id
      creator_id
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
      threads {
        id
        sale_offer_id
        creator_id
        comments {
          id
          thread_id
          author_id
          content
          is_read
          created_at
        }
      }
      created_at
      updated_at
    }
  }
`;

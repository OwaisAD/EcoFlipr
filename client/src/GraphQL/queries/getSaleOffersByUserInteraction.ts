import { gql } from "@apollo/client";

export const GET_SALE_OFFERS_BY_USER_INTERACTION = gql`
  query GetSaleOffersByUserInteraction {
    getSaleOffersByUserInteraction {
      id
      notification_count
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

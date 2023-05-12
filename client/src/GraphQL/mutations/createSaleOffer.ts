import { gql } from "@apollo/client";

export const CREATE_SALE_OFFER = gql`
  mutation Mutation($input: SaleOfferInput) {
    createSaleOffer(input: $input) {
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

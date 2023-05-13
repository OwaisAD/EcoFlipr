import { gql } from "@apollo/client";

export const UPDATE_SALE_OFFER = gql`
  mutation Mutation($updateSaleOfferId: ID!, $input: SaleOfferUpdateInput) {
    updateSaleOffer(id: $updateSaleOfferId, input: $input) {
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

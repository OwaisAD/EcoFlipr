import { gql } from "@apollo/client";

export const GET_SALE_OFFERS_BY_SEARCH_QUERY = gql`
  query GetSaleOfferBySearchQuery($searchQuery: String, $page: Int) {
    getSaleOfferBySearchQuery(searchQuery: $searchQuery, page: $page) {
      pagination {
        count
        pageCount
      }
      saleOffers {
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
        created_at
        updated_at
      }
    }
  }
`;

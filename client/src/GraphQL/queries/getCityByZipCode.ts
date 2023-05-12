import { gql } from "@apollo/client";

export const GET_CITY_BY_ZIP_CODE = gql`
  query Query($zipCode: String) {
    getCityByZipCode(zip_code: $zipCode) {
      id
      name
      zip_code
    }
  }
`;

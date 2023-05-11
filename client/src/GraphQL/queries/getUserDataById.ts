import { gql } from "@apollo/client";

export const GET_USER_DATA_BY_ID = gql`
  query GetUser($getUserDataByIdId: String) {
    getUserDataById(id: $getUserDataByIdId) {
      id
      first_name
      last_name
      phone_number
    }
  }
`;

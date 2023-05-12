import { gql } from "@apollo/client";

export const GET_USER_NOTIFICATION_COUNT = gql`
  query Query {
    getUserNotificationCount
  }
`;

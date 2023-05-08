import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Mutation($input: UserLoginInput) {
    login(input: $input) {
      jwtToken
    }
  }
`
import { gql } from "@apollo/client";

export const MARK_THREAD_AS_READ = gql`
  mutation Mutation($threadId: String) {
    markThreadAsRead(threadId: $threadId)
  }
`;

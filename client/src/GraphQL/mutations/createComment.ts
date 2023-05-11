import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput) {
    createComment(input: $input) {
      id
      thread_id
      author_id
      content
      is_read
      created_at
    }
  }
`;

import { ObjectId, isValidObjectId } from "mongoose";
import Thread from "../../models/thread";
import { Context } from "../../types/context";
import { ThreadInput } from "../../types/thread";
import { throwError } from "../../utils/errorHandler";
import { validateId } from "../../utils/validator";
import Comment from "../../models/comment";

export const threadResolver = {
  Mutation: {
    markThreadAsRead: async (_parent: never, args: ThreadInput, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throwError("not authenticated");
      }

      const { threadId } = args;

      const isValidThreadId = validateId(threadId);

      if (!isValidThreadId) {
        throwError("Invalid thread id");
      }

      const threadFromDb = await Thread.findById(threadId);

      if (!threadFromDb) {
        throwError("No threads founds");
      }

      const comments = await Comment.find({ thread_id: threadId, author_id: { $ne: currentUser!._id } });

      if (!comments) {
        return "no comments found in thread";
      }

      if (!(threadFromDb?._id.toString() === comments[0].thread_id.toString())) {
        throwError("Not authorized");
      }

      comments.forEach((comment) => {
        comment.is_read = true;
        saveComment(comment);
      });

      return "Success";
    },
  },
};

const saveComment = async (comment: any) => {
  await comment.save();
};

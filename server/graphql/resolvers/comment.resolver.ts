import { GraphQLError } from "graphql";
import Comment from "../../models/comment";
import { CommentInput } from "../../types/comment";
import { Context } from "../../types/context";
import SaleOffer from "../../models/saleoffer";
import { validateId } from "../../utils/validator";
import User from "../../models/user";
import Thread from "../../models/thread";
import { IThread } from "../../types/thread";
import { infoLog } from "../../utils/logger";
import { throwError } from "../../utils/errorHandler";

export const commentResolver = {
  Mutation: {
    createComment: async (_parent: never, args: CommentInput, { currentUser }: Context, _info: any) => {
      // Checking if currentUser is valid
      if (!currentUser) {
        throwError("not authenticated");
      }

      const { threadId, saleOfferId, content } = args.input;

      // Checking if saleoffer id and the saleoffer itself is valid
      const isValidSaleOfferId = validateId(saleOfferId);
      if (!isValidSaleOfferId) {
        throwError("invalid id");
      }

      const saleOffer = await SaleOffer.findById(saleOfferId);
      if (!saleOffer) {
        throwError("saleoffer not found");
      }

      // checking who the owner of the saleoffer is and comparing it to the currentuser
      const saleOfferOwner: any = await User.findOne({ sale_offers: saleOffer!._id });

      if (saleOfferOwner._id.toString() === currentUser!._id.toString()) {
        infoLog("OWNER OF SALEOFFER");
        const isValidThreadId = validateId(threadId);
        if (!threadId || !isValidThreadId) {
          throwError("Please enter a valid thread id");
        }

        const currentOwnerThread: IThread | null = await Thread.findById(threadId);
        if (!currentOwnerThread) {
          throwError("something went wrong. Please try again tomorrow.");
        }
        const newComment = await Comment.create({ content, thread_id: currentOwnerThread!._id });
        currentOwnerThread!.comments.push(newComment._id);
        currentOwnerThread!.save();
        return newComment;
      } else {
        infoLog("NOT OWNER OF SALEOFFER");
        infoLog("CHECKING IF ANY THREADS EXIST");
        if (!saleOffer!.threads.length) {
          infoLog(
            `no threads exist, creating first thread for the sale_offer with id: ${saleOffer!.id} started by ${
              currentUser!.first_name
            }`
          );
          await Thread.create({ creator_id: currentUser!._id });
          const getTheNewThread: IThread | null = await Thread.findOne({
            sale_offer_id: saleOffer!._id,
            creator_id: currentUser!._id,
          });
          if (getTheNewThread) {
            const newComment = await Comment.create({ content, thread_id: getTheNewThread._id });
            getTheNewThread.comments.push(newComment._id);
            const savedThread = await getTheNewThread.save();
            saleOffer!.threads.push(savedThread._id);
            await saleOffer!.save();
            return newComment;
          } else {
            throwError("Something went wrong. Try again tomorrow.");
          }
        } else {
          infoLog("there's a thread. Checking if currentUser owns it");
          const currentUserOwnsThread: IThread | null = await Thread.findOne({
            sale_offer_id: saleOffer!._id,
            creator_id: currentUser!._id,
          });
          if (currentUserOwnsThread) {
            infoLog("User already started a thread");
            const newComment = await Comment.create({ content, thread_id: currentUserOwnsThread._id });
            currentUserOwnsThread.comments.push(newComment._id);
            await currentUserOwnsThread.save();
            return newComment;
          } else {
            infoLog(`no threads for ${currentUser!.first_name}, creating a new thread`);
            await Thread.create({ sale_offer_id: saleOffer!._id, creator_id: currentUser!._id });
            const getTheNewThread: IThread | null = await Thread.findOne({
              sale_offer_id: saleOffer!._id,
              creator_id: currentUser!._id,
            });
            if (getTheNewThread) {
              const newComment = await Comment.create({ content, thread_id: getTheNewThread._id });
              getTheNewThread.comments.push(newComment._id);
              const savedThread = await getTheNewThread.save();
              saleOffer!.threads.push(savedThread._id);
              await saleOffer!.save();
              return newComment;
            } else {
              throwError("Something went wrong. Try again tomorrow.");
            }
          }
        }
      }
    },
  },
};

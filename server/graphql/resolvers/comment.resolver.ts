import { GraphQLError } from "graphql";
import Comment from "../../models/comment";
import { CommentInput } from "../../types/comment";
import { Context } from "../../types/context";
import SaleOffer from "../../models/saleoffer";
import { validateId } from "../../utils/validator";
import User from "../../models/user";
import Thread from "../../models/thread";
import { IThread } from "../../types/thread";

export const commentResolver = {
  Mutation: {
    createComment: async (_parent: never, args: CommentInput, { currentUser }: Context, _info: any) => {
      // Check om currentuser er valid
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const {threadId, saleOfferId, content} = args.input      

      // Check om saleoffer er valid
      const isValidSaleOfferId = validateId(saleOfferId)
      if(!isValidSaleOfferId){
        throw new GraphQLError("invalid id", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const saleOffer = await SaleOffer.findById(saleOfferId)
      if(!saleOffer) {
        throw new GraphQLError("saleoffer not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    
      // 1. hvis saleoffer ejes af currentUserId && thread creatorID !== currentUserId
      const saleOfferOwner: any = await User.findOne({sale_offers: saleOffer._id})

      if(saleOfferOwner._id.toString() === currentUser._id.toString()) {
        //   -> hvis ja hop til ejerperspektiv
        console.log("OWNER OF SALEOFFER");
        const isValidThreadId = validateId(threadId)
        if(!threadId || !isValidThreadId) {
          throw new Error("Please enter a valid thread id")
        }

        const currentOwnerThread: IThread | null = await Thread.findById(threadId)
        if(!currentOwnerThread) {
            throw new Error("something went wrong. Please try again tomorrow.")
        }
        const newComment = await Comment.create({content})
        currentOwnerThread.comments.push(newComment._id)
        currentOwnerThread.save()
        return newComment;
      } else {
        //   -> hvis nej hop til køberperspektiv
        console.log("NOT OWNER OF SALEOFFER");
       
        if(!saleOffer.threads.length){
          console.log(`no threads, creating first thread for the sale_offer with id: ${saleOffer.id} started by ${currentUser.first_name}`);
            await Thread.create({creator_id: currentUser._id})
            const newComment = await Comment.create({content})
            const getTheNewThread: IThread | null = await Thread.findOne({creator_id: currentUser._id})
            if(getTheNewThread) {
              getTheNewThread.comments.push(newComment._id)
              const savedThread = await getTheNewThread.save()
              saleOffer.threads.push(savedThread._id)
              await saleOffer.save()
              return newComment;
            } else {
              throw new Error("Something went wrong. Try again tomorrow.")
            }
        } else {
          console.log("there's a thread. Checking if currentUser owns it");
          const currentUserOwnsThread: IThread | null = await Thread.findOne({creator_id: currentUser._id})
          if(currentUserOwnsThread) {
            console.log('User already started a thread');
            const newComment = await Comment.create({content})
            currentUserOwnsThread.comments.push(newComment._id)
            await currentUserOwnsThread.save()
            return newComment
          } else {
            console.log(`no threads for ${currentUser.first_name}, creating a new thread`);
            await Thread.create({creator_id: currentUser._id})
            const newComment = await Comment.create({content})
            const getTheNewThread: IThread | null = await Thread.findOne({creator_id: currentUser._id})
            if(getTheNewThread) {
              getTheNewThread.comments.push(newComment._id)
              const savedThread = await getTheNewThread.save()
              saleOffer.threads.push(savedThread._id)
              await saleOffer.save()
              return newComment;
            } else {
              throw new Error("Something went wrong. Try again tomorrow.")
            }
          }
        }
        
      }


      
      // Køberperspektiv 
      // 2: 
      // Check om Saleoffer har en tråd med creatorID ==== currentUserId
      //   -> Hvis nej: Vi opretter en ny tråd med currentUserId som creatorId og tilføjer til comment array på tråden
      //   -> Hvis ja: vi laver en comment og tilføjer til comment array på tråden
      
      // Ejerpespektiv
      //   -> Check om ThreadId er i saleoffer Threads
      //   -> hvis nej throw error
      //   -> hvis ja add comment til comment array på tråden
    },
  },
};

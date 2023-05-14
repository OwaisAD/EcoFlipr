import User from "../../models/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validateUserInput, validateId, validatePassword } from "../../utils/validator";
import { Context } from "../../types/context";
import { GraphQLError } from "graphql";
import { UserId, UserInputWithPass, UserInputWithoutPass, UserUpdatePassInput } from "../../types/user";
import { throwError } from "../../utils/errorHandler";
import Thread from "../../models/thread";
import SaleOffer from "../../models/saleoffer";
import Comment from "../../models/comment";

export const userResolver = {
  Query: {
    getUser: async (_parent: never, _args: never, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return await User.findById(currentUser._id, { sale_offers: false });
    },
    getUserDataById: async (_parent: never, { id }: UserId, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const isValidId = validateId(id);

      if (!isValidId) {
        throwError(`ID ${id} was not found`);
      }

      let userFromDB = await User.findById(id, { sale_offers: false });
      return {
        id: userFromDB?._id,
        first_name: userFromDB?.first_name,
        last_name: userFromDB?.last_name,
        phone_number: userFromDB?.phone_number,
      };
    },
    getUserNotificationCount: async (_parent: never, _args: never, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // CALCULATE NOTIFICATION COUNT BASED ON SALE OFFERS YOU CREATED AND THREADS
      let notificationCount = 0;

      const saleOffers = await SaleOffer.find({ creator_id: currentUser._id })
        .populate("city")
        .populate("category")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      // calculate notifications
      saleOffers.forEach((saleOffer) => {
        saleOffer.threads.forEach((thread) => {
          thread.comments.forEach((comment) => {
            if (!comment.is_read && comment.author_id.toString() !== currentUser._id.toString()) {
              notificationCount++;
            }
          });
        });
      });

      // run through threads you have generated
      const threads = await Thread.find({ creator_id: currentUser._id });

      if (!threads) {
        throwError("You haven't interacted on any sale offers");
      }
      let threadIds = threads.map((thread) => new mongoose.Types.ObjectId(thread.sale_offer_id));

      const saleOffersInteractedWith = await SaleOffer.find({ _id: { $in: threadIds } })
        .populate("category")
        .populate("city")
        .populate({ path: "threads", model: Thread, populate: { path: "comments", model: Comment } });

      // calculate notifications
      saleOffersInteractedWith.forEach((saleOffer) => {
        saleOffer.threads.forEach((thread) => {
          if (thread && thread.creator_id.toString() === currentUser._id.toString()) {
            thread.comments.forEach((comment) => {
              if (!comment.is_read && comment.author_id.toString() !== currentUser._id.toString()) {
                notificationCount++;
              }
            });
          }
        });
      });
      return notificationCount;
    },
  },
  Mutation: {
    createUser: async (_parent: never, args: UserInputWithPass, _context: never) => {
      let { email, first_name, last_name, phone_number, address, password } = args.input;

      validateUserInput(args);

      email = email.toLowerCase();
      try {
        const userFromDB = await User.findOne({ email });
        if (userFromDB) {
          throw new Error("Unique error");
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const createdUser = await User.create({ email, first_name, last_name, phone_number, address, passwordHash });

        if (!createdUser) {
          throw new Error("Something went wrong");
        }
        return "Success";
      } catch (error: unknown) {
        throw new Error("Couldn't create new user");
      }
    },
    updateUser: async (_parent: never, args: UserInputWithoutPass, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const { email, first_name, last_name, phone_number, address } = args.input;
      validateUserInput(args);

      try {
        const userFromDb = await User.findById(currentUser._id);

        if (!userFromDb) {
          throw new Error(`User was not found.`);
        }

        const updatedUser = await User.findByIdAndUpdate(
          currentUser._id,
          {
            email,
            first_name,
            last_name,
            phone_number,
            address,
          },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Something went wrong");
        }

        return await User.findById(currentUser._id, { sale_offers: false });
      } catch (error: unknown) {
        throw new Error("Couldn't update user");
      }
    },
    deleteUser: async (_parent: never, _args: never, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const userFromDb = await User.findById(currentUser._id).populate({
          path: "sale_offers",
          populate: { path: "threads", populate: { path: "comments" } },
        });

        if (!userFromDb) {
          return { id: currentUser._id };
        }

        const saleOfferIds = userFromDb.sale_offers.map((sale_offer) => sale_offer._id);
        await SaleOffer.deleteMany({ _id: { $in: saleOfferIds } });

        const threadIds = userFromDb.sale_offers
          .map((sale_offer) => {
            return sale_offer.threads.map((thread) => thread._id);
          })
          .flat();
        await Thread.deleteMany({ _id: { $in: threadIds } });

        const commentIds = userFromDb.sale_offers
          .map((sale_offer) => {
            return sale_offer.threads.map((thread) => thread.comments.map((comment) => comment._id));
          })
          .flat(2);
        await Comment.deleteMany({ _id: { $in: commentIds } });

        // find threads
        const userCreatedThreads = await Thread.find({ creator_id: currentUser._id }).populate("comments");
        const userCreatedThreadsIds = userCreatedThreads.map((thread) => thread._id);

        // find sale offers where the thread was made by the user
        const saleOffersIdsFromUserThreads = userCreatedThreads.map((thread) => thread.sale_offer_id);
        const foundSaleOffers = await SaleOffer.find({ _id: { $in: saleOffersIdsFromUserThreads } }).populate(
          "threads"
        );
        foundSaleOffers.forEach((saleOffer) => {
          saleOffer.threads = saleOffer.threads.filter(
            (thread) => thread.creator_id.toString() !== currentUser._id.toString()
          );
          saleOffer.save();
        });
        await Thread.deleteMany({ _id: { $in: userCreatedThreadsIds } });

        // find comments
        const otherCommentsToDelete = userCreatedThreads
          .map((thread) => {
            return thread.comments.map((comment) => comment._id);
          })
          .flat();
        await Comment.deleteMany({ _id: { $in: otherCommentsToDelete } });
        await User.deleteOne(currentUser._id);

        return { id: currentUser._id };
      } catch (error) {
        //
      }
    },
    updateUserPassword: async (_parent: never, args: UserUpdatePassInput, { currentUser }: Context) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const { newPassword } = args.input;

      validatePassword(newPassword);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      currentUser.passwordHash = passwordHash;
      await currentUser.save();

      return "Updated successfully";
    },
  },
};

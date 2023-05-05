import User from "../../models/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validateUserInput, validateId, validatePassword } from "../../utils/validator";
import { AuthenticationError } from "apollo-server-express";
import { Context } from "../../types/context";
import { GraphQLError } from "graphql";
import { errorLog } from "../../utils/logger";
import { UserUpdatePassInput } from "../../types/user";
import { throwError } from "../../utils/errorHandler";
import Thread from "../../models/thread";
import SaleOffer from "../../models/saleoffer";
import Comment from "../../models/comment";

type User = {
  id: mongoose.Types.ObjectId;
};

export const userResolver = {
  Query: {
    getUserById: async () => {},
    getUserNotifications: async () => {},
  },
  Mutation: {
    createUser: async (_parent: any, args: any, _context: any, _info: any) => {
      let { email, first_name, last_name, phone_number, address, password } = args.input;
      validateUserInput({ email, first_name, last_name, phone_number, address, password });

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
        return createdUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    updateUserById: async (_parent: any, args: any, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const { id, email, first_name, last_name, phone_number, address } = args.input;

      const isValidUserId = validateId(id);

      if (!isValidUserId || id !== currentUser._id.toString()) {
        errorLog("Invalid user id or unauthorized");
        throw new GraphQLError("not authorized", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      validateUserInput({ email, first_name, last_name, phone_number, address });

      try {
        const userFromDb = await User.findById(id);

        if (!userFromDb) {
          throw new Error(`User with id ${id} was not found.`);
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
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

        return updatedUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    deleteUser: async (_parent: any, _args: never, { currentUser }: Context, _info: any) => {
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
        console.log("saleOfferIds", saleOfferIds);
        await SaleOffer.deleteMany({ _id: { $in: saleOfferIds } });

        const threadIds = userFromDb.sale_offers
          .map((sale_offer) => {
            return sale_offer.threads.map((thread) => thread._id);
          })
          .flat();
        console.log("threadIds", threadIds);
        await Thread.deleteMany({ _id: { $in: threadIds } });

        const commentIds = userFromDb.sale_offers
          .map((sale_offer) => {
            //@ts-ignore
            return sale_offer.threads.map((thread) => thread.comments.map((comment) => comment._id));
          })
          .flat(2);
        console.log("commentIds", commentIds);
        await Comment.deleteMany({ _id: { $in: commentIds } });

        // find tråde
        const userCreatedThreads = await Thread.find({ creator_id: currentUser._id }).populate("comments");
        const userCreatedThreadsIds = userCreatedThreads.map((thread) => thread._id);

        // find sale offers where the thread was made by the user
        const saleOffersIdsFromUserThreads = userCreatedThreads.map((thread) => thread.sale_offer_id);
        const foundSaleOffers = await SaleOffer.find({ _id: { $in: saleOffersIdsFromUserThreads } }).populate(
          "threads"
        );
        foundSaleOffers.forEach((saleOffer) => {
          saleOffer.threads = saleOffer.threads.filter(
            //@ts-ignore
            (thread) => thread.creator_id.toString() !== currentUser._id.toString()
          );
          saleOffer.save();
        });

        console.log("userCreatedThreadIds", userCreatedThreadsIds);
        await Thread.deleteMany({ _id: { $in: userCreatedThreadsIds } });

        // find kommentarer
        const otherCommentsToDelete = userCreatedThreads
          .map((thread) => {
            //@ts-ignore
            return thread.comments.map((comment) => comment._id);
          })
          .flat();
        console.log("otherComments..", otherCommentsToDelete);
        await Comment.deleteMany({ _id: { $in: otherCommentsToDelete } });

        await User.deleteOne(currentUser._id);

        return { id: currentUser._id };
      } catch (error) {
        //
      }
    },
    updateUserPasswordById: async (_parent: never, args: UserUpdatePassInput, { currentUser }: Context, _info: any) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const { id, newPassword } = args.input;

      const isValidUserId = validateId(id);
      const isValidPassword = validatePassword(newPassword);

      if (!isValidUserId || !isValidPassword || id !== currentUser._id.toString()) {
        errorLog("Invalid user id or unauthorized");
        throw new GraphQLError("not authorized", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      currentUser.passwordHash = passwordHash;
      await currentUser.save();

      return "Updated successfully";
    },
  },
};

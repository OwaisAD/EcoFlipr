import User from "../../models/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validateUserInput, validateId } from "../../utils/validator";
import { AuthenticationError } from "apollo-server-express";

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
    updateUserById: async (_parent: any, args: any, _context: any, _info: any) => {
      const { id, email, first_name, last_name, phone_number, address } = args.input;

      const isValidUserId = validateId(id);

      if (!isValidUserId) {
        return;
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
    deleteUserById: async (_parent: any, { id }: User, _context: any, _info: any) => {
      const isValidUserId = validateId(id);

      if (!isValidUserId) {
        return;
      }

      try {
        //TODO: Når en bruger bliver slettet skal alle brugerens SaleOffers og Threads,
        // der er tilknyttet samme bruger også slettes,
        // samt andre brugere's Threads tilknyttet til brugerens SaleOffers.
        const userFromDb = await User.findById(id);

        if (!userFromDb) {
          return { id };
        }
        //TODO: Valider at request har et id i sig, hvis det ikke matcher bruger id'et skal der ikke ske noget.
        await User.findByIdAndDelete(id);

        return { id };
      } catch (error) {
        //
      }
    },
    updateUserPasswordById: async (_parent: any, { id }: User, _context: any, _info: any) => {
      // make sure that user id is the one that is logged in!
    },
  },
};

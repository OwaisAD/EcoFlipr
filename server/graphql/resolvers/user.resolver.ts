import User from "../../models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserInputWithPass, UserInputWithoutPass } from "../../types/user";

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
      const { email, first_name, last_name, phone_number, address, password } = args.input;

      validateUserInput({ email, first_name, last_name, phone_number, address, password });

      try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const createdUser = User.create({ email, first_name, last_name, phone_number, address, passwordHash });

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
        const userFromDb = await User.findById(id);

        if (!userFromDb) {
          return { id };
        }

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

const validateId = (id: any) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateUserInput = (userInput: UserInputWithPass | UserInputWithoutPass) => {
  const { email, first_name, last_name, phone_number, address } = userInput;

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!first_name || first_name.length < 2 || first_name.length > 50) {
    throw new Error("Please enter a valid firstname");
  }

  if (!last_name || last_name.length < 2 || last_name.length > 50) {
    throw new Error("Please enter a valid lastname");
  }
  if (!phone_number || !validator.isMobilePhone(phone_number, "da-DK")) {
    throw new Error("The entered phonenumber is not a valid Danish number");
  }

  if (!address || address.length < 5 || address.length > 100) {
    throw new Error("Please enter a valid address");
  }

  if ("password" in userInput && (!userInput.password || userInput.password.length < 8)) {
    throw new Error("Please enter a valid password");
  }
  return true;
};

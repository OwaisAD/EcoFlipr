import User from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { throwError } from "../../utils/errorHandler";
import { validateLogin } from "../../utils/validator";

type UserInput = {
  input: {
    email: string;
    password: string;
  };
};

export const loginResolver = {
  Mutation: {
    login: async (_parent: never, args: UserInput, _context: never, _info: never) => {
      let { email, password } = args.input;

      validateLogin(email, password);

      email = email.toLowerCase();

      const user = await User.findOne({ email });
      const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new Error("Invalid email or password");
      }

      const userToken = {
        id: user._id,
        first_name: user.first_name,
      };

      // @ts-ignore
      const token = jwt.sign(userToken, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return {
        jwtToken: token,
      };
    },
  },
};

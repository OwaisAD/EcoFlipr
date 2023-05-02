import User from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type UserInput = {
  input: {
    email:string,
    password:string
  }
};

export const loginResolver = {
  Mutation: {
    login: async (_parent: never, args:UserInput, _context: never, _info: never) => {
      let {email, password} = args.input

      email = email.toLowerCase();

      const user = await User.findOne({email});
      const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new Error("Invalid email or password");
      };

      const userToken = {
        email: user.email,
        id: user._id
      };
      console.log(user)
      // @ts-ignore
      const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: 60 * 60});
      console.log(token)
      return {
        jwtToken:token,
        email:user.email,
        first_name:user.first_name
      }
    },
  },
};

const resolvers = {
  Query: {
    hello: () => {
      return "Hello World!";
    },
  },
  Mutation: {
    createPost: async (parent: any, args: any, context: any, info: any) => {
      console.log("CREATING POST");
    },
  },
};

export default resolvers;

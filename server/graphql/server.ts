import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { infoLog } from "../utils/logger";

interface MyContext {}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async () => ({}),
    listen: {
      port: 4000,
    },
  });
  return url;
};

const url = startServer();

infoLog(`🚀  Server ready at: ${url}`);

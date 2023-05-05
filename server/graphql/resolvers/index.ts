import { categoryResolver } from "./category.resolver";
import { saleOfferResolver } from "./saleoffer.resolver";
import { commentResolver } from "./comment.resolver";
import { loginResolver } from "./login.resolver";
import { userResolver } from "./user.resolver";
import { cityResolver } from "./city.resolver";
import { threadResolver } from "./thread.resolver";

// const resolvers = [categoryResolver, saleOfferResolver];
const resolvers = [
  categoryResolver,
  saleOfferResolver,
  commentResolver,
  loginResolver,
  userResolver,
  cityResolver,
  threadResolver,
];

export default resolvers;

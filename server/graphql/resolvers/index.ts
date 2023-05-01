import { categoryResolver } from "./category.resolver";
import { saleOfferResolver } from "./saleoffer.resolver";
import { commentResolver } from "./comment.resolver";
import { loginResolver } from "./login.resolver";
import { userResolver } from "./user.resolver";

// const resolvers = [categoryResolver, saleOfferResolver];
const resolvers = [categoryResolver, saleOfferResolver, commentResolver, loginResolver, userResolver];

export default resolvers;

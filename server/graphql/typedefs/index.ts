import types from "./types";
import QueriesAndMutations from "./QueriesAndMutations";

const typeDefs = [
  QueriesAndMutations,
  types.categoryType,
  types.cityType,
  types.commentType,
  types.saleofferType,
  types.threadType,
  types.userType,
];

export default typeDefs;

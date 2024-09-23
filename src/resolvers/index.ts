import { addressResolves } from "./RAddress";
import { userResolvers } from "./RUser";

export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...addressResolves.Query

    },

    Mutation: {
        ...userResolvers.Mutation,
        ...addressResolves.Mutation


    }

}
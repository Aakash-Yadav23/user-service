import { ApolloError } from "apollo-server";
import { verifyToken } from "../utils/password";

export const AuthMiddleware = (context: any) => {
    
    const { token } = context;
    console.log("TOken",token)
    
    if (!token) {
        throw new ApolloError("Unauthorized: No token provided", "UNAUTHORIZED");
    }

    const user = verifyToken(token); 

    console.log("User",user)

    if (!user) {
        throw new ApolloError("Unauthorized: Invalid token", "UNAUTHORIZED");
    }

    return user;
};

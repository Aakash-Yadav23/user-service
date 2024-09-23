import { ApolloError } from "apollo-server";
import { verifyToken } from "../utils/password";

export const AuthMiddleware = (context: any) => {
    
    const { token } = context;
    console.log("TOken",token)
    
    if (!token) {
        throw new ApolloError("Unauthorized: No token provided", "UNAUTHORIZED");
    }



    let user;
    try {
        user = verifyToken(token);
    } catch (error) {
        throw new ApolloError("Unauthorized: Invalid token", "UNAUTHORIZED");
    }


    if (!user.id) {
        throw new ApolloError("Unauthorized: Invalid token", "UNAUTHORIZED");
    }

    return user.id;
};

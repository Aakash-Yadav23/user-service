import { string } from "joi";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/UserService"
import { ApolloError } from "apollo-server";
import { CustomError } from "../handlers/CustomError";

const userService = new UserService();

export const userResolvers = {

    Query: {

        getUser: async (_: any, { id }: { id: string }) => {


            return {
                id,
                firstName: "Akash Kumar"
            }

        },

        getUsers: async () => {
            return [
                { id: "1", firstName: "Akash Kumar" },
                { id: "2", firstName: "John Doe" }
            ];
        }

    },

    Mutation: {
        registerUser: async (_: any, { input }: { input: Partial<IUser> }, context: any) => {
            try {
                const userAgent = context.userAgent;


                console.log("UserAgent", userAgent)

                input = {
                    ...input,
                    device: userAgent
                }
                return await userService.RegisterUser(input);


            } catch (error: any) {
                if (error instanceof CustomError) {

                    throw new ApolloError(error.message, error.code + "");
                }
                throw new ApolloError(error.message);

            }
        },
        loginUser: async (_: any, { input }: { input: Partial<IUser> }, context: any) => {
            try {
                const token = await userService.loginUser(input);
                context.res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000,
                    sameSite: 'Strict',
                })
                return token;
            } catch (error: any) {
                if (error instanceof CustomError) {
                    throw new ApolloError(error.message, error.code + "");
                }
                throw new ApolloError(error.message);
            }
        },
    }


}
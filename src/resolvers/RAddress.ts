import { ApolloError } from "apollo-server";
import { IAddress } from "../interfaces/IAddress";
import { AddressService } from "../services/AddressService";
import { CustomError } from "../handlers/CustomError";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { UserService } from "../services/UserService";



export const addressResolves = {
    Query: {

        getAddress: async (_: any, { id }: { id: string }, context: any) => {
            AuthMiddleware(context)


            return {
                id,
                firstName: "Akash Kumar"
            }

        },

        getAddressesByUser: async (_: any, context: any) => {
            const userId = AuthMiddleware(context)
            console.log("UserId", userId)
            const userService = new UserService();

            return await userService.GetMe(userId)


        }

    },

    Mutation: {

        createAddress: async (_: any, { input }: { input: Partial<IAddress> }, context: any) => {
            try {

                const userId = AuthMiddleware(context)
                console.log("UsreID", userId)
                const addressService = new AddressService();



                input = {
                    ...input,
                    userId:userId!
                }


            return addressService.CreateAddress(input)

            } catch (error: any) {
                if (error instanceof CustomError) {

                    throw new ApolloError(error.message, error.code + "");
                }
                throw new ApolloError(error.message);

            }
        },
        updateAddress: async (_: any, { input }: { input: Partial<IAddress> }, context: any) => {
            AuthMiddleware(context)

        },
        deleteAddress: async (_: any, { id }: { id: string }, context: any) => {
            AuthMiddleware(context)

        }


    }








}
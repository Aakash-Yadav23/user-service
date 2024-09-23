import { ApolloError } from "apollo-server";
import { IAddress } from "../interfaces/IAddress";
import { AddressService } from "../services/AddressService";
import { CustomError } from "../handlers/CustomError";
import { AuthMiddleware } from "../middleware/AuthMiddleware";



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
            AuthMiddleware(context)

            return [
                { id: "1", firstName: "Akash Kumar" },
                { id: "2", firstName: "John Doe" }
            ];
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
                }


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
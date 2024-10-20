import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserService } from "../service/AuthService.service";
import { emailVerifySchema, forgetPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updateUserSchema } from "../models/dto/User.dto";
import { ValidateDto, verifyToken } from "../utils/utils";
import { CustomError } from "../Error/ErrorHandler";


export const UserRoutes = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const token = event.headers.Authorization?.split(' ')[1];
        console.log("EVENT", event.path);
        console.log("token", token);

        if (event.path === '/auth') {
            if (!token) {
                return {
                    statusCode: 401,
                    headers:{
                        "Access-Control-Allow-Origin": "*", 
                        "Access-Control-Allow-Credentials": true, 
                    },
                    body: JSON.stringify({ message: 'Unauthorized, missing token' })
                };
            }
            const decoded = await verifyToken(token!);
            console.log("authenticated", decoded.authenticated)

            if (!decoded.authenticated) {
                return {
                    statusCode: 401,
                    headers:{
                        "Access-Control-Allow-Origin": "*", 
                        "Access-Control-Allow-Credentials": true, 
                    },
                    body: JSON.stringify({ message: 'Unauthorized, invalid token' })
                };
            }
        };

        if (event.httpMethod === "POST" && event.path === '/register') {
            console.log("Request Body:", JSON.parse(event.body!));

            const value = ValidateDto(registerSchema, JSON.parse(event.body!));
            return await new UserService().registerUser(value);
        }
        else if (event.httpMethod === "POST" && event.path === '/forget-password') {
            const value = ValidateDto(forgetPasswordSchema, JSON.parse(event.body!));
            return await new UserService().forgetPassword(value);
        }
        else if (event.httpMethod === "POST" && event.path === '/email-verify') {
            const value = ValidateDto(emailVerifySchema, JSON.parse(event.body!));
            return await new UserService().emailVerifyUser(value);
        }
        else if (event.httpMethod === "POST" && event.path === '/reset-password') {
            const value = ValidateDto(resetPasswordSchema, JSON.parse(event.body!));
            return await new UserService().resetPassword(value);
        }
        else if (event.httpMethod === "POST" && event.path === '/login') {
            const value = ValidateDto(loginSchema, JSON.parse(event.body!));
            return await new UserService().loginUser(value);
        }
        else if (event.httpMethod === "PUT" && event.path === '/auth') {
            const value = ValidateDto(updateUserSchema, JSON.parse(event.body!));
            return await new UserService().updateUser(value, token!);

        }
        else if (event.httpMethod === "GET" && event.path === '/auth') {
            return await new UserService().getUserDetails(token);
        }
        return {
            statusCode: 404,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true, 
            },
            body: JSON.stringify({
                message: "Invalid Path",
                error: "The requested path does not exist."
            }),
        };

    } catch (error: any) {
        console.log("ERRROR", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.details)
        }
        throw new Error(error.message);
    }

}
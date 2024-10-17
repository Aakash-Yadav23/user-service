import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserService } from "../service/AuthService.service";
import { loginSchema, registerSchema, updateUserSchema } from "../models/dto/User.dto";
import { ValidateDto, verifyToken } from "../utils/utils";
import { CustomError } from "../Error/ErrorHandler";


export const UserRoutes = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const token = event.headers.Authorization?.split(' ')[1];
        console.log("EVENT",event.path);
        console.log("token",token);

        if ((event.path !== '/auth'&& event.httpMethod!="POST")||event.path !== '/register') {
            if (!token) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Unauthorized, missing token' })
                };
            }
            const decoded = await verifyToken(token!);
            if (!decoded.authenticated) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Unauthorized, invalid token' })
                };
            }
        }

        if (event.httpMethod === "POST" && event.path === 'register') {
            const value = ValidateDto(registerSchema, JSON.parse(event.body!));
            return await new UserService().registerUser(value);
        }
        else if (event.httpMethod === "POST") {
            const value = ValidateDto(loginSchema, JSON.parse(event.body!));
            return await new UserService().loginUser(value);
        }
        else if (event.httpMethod === "PUT") {
            const value = ValidateDto(loginSchema, JSON.parse(event.body!));
            return await new UserService().updateUser(value, token!);

        }

        return await new UserService().getUserDetails(token);



    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.details)
        }
        throw new Error(error.message);
    }

}
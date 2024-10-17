import { APIGatewayProxyResult } from "aws-lambda";
import { IUser } from "../interfaces/IUser";
import { dbConnect, generateToken, SuccessReponse, verifyToken } from "../utils/utils";
import { UserRepository } from "../repository/User.repository";
import { CustomError } from "../Error/ErrorHandler";
const {StatusCodes} =require('http-status-codes');
const bcrypt =require('bcrypt');

export class UserService {

    constructor() {

        dbConnect();
    }

    public registerUser = async (body: IUser): Promise<APIGatewayProxyResult> => {
        const user = await new UserRepository().RegisterUser(body);

        return SuccessReponse(200, user);
    };

    public loginUser = async (body: Partial<IUser>): Promise<APIGatewayProxyResult> => {

        const findUser = await new UserRepository().GetUserByMail(body.email!) as unknown as IUser || null;
        if (!findUser._id) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(body.password!, findUser.password!);
        if (!isMatch) {
            throw new CustomError("Invalid Credentials!", StatusCodes.UNAUTHORIZED);
        }
        const token = generateToken(findUser._id!, findUser.email, findUser.first_name, findUser.last_name)
        return SuccessReponse(200, token);
    };

 
    public updateUser = async (body: Partial<IUser>, token: string): Promise<APIGatewayProxyResult> => {
        const decoded = await verifyToken(token!);


        const userId=decoded.decoded._id;

        const user = await new UserRepository().GetUserById(userId!);
        if (!user) {
            console.error("User not found for ID: ", userId);
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND);
        }
        const updateUser=await new UserRepository().UpdateUser(body);
        return SuccessReponse(200, updateUser);
    };


    public getUserDetails = async (token: any): Promise<APIGatewayProxyResult> => {
        const decoded = verifyToken(token) as Partial<IUser>;
        const userId = decoded._id ;
        const user = await new UserRepository().GetUserById(userId);
        if (!user) {
            console.error("User not found for ID: ", userId);
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND);
        }
        return SuccessReponse(200, user);
    }

}
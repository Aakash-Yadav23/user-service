import { APIGatewayProxyResult } from "aws-lambda";
import { IUser } from "../interfaces/IUser";
import { dbConnect, ErrorReponse, generateOTP, generateToken, SuccessReponse, verifyToken } from "../utils/utils";
import { UserRepository } from "../repository/User.repository";
import { CustomError } from "../Error/ErrorHandler";
const { StatusCodes } = require('http-status-codes');
import { SQS } from 'aws-sdk';

const bcrypt = require('bcrypt');
const sqs = new SQS();
const EMAIL_QUEUE_URL = process.env.EMAIL_QUEUE_URL;

export class UserService {

    public registerUser = async (body: IUser): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const checkIfUserExists = await new UserRepository().GetUserByMail(body.email!) as IUser || null;
        if (checkIfUserExists) {
            throw new CustomError("Email already Used!", StatusCodes.CONFLICT, "This Email is already used with other user.");
        };
        const otp = generateOTP(6);
        const dataToSend: IUser = {
            ...body,
            emailVerified: false,
            otp,
            otpExpire: new Date(Date.now() + 15 * 60 * 10000)
        }
        const user = await new UserRepository().RegisterUser(dataToSend);

        // Prepare message for the SQS queue
        const messageToQueue = {
            subject: "OTP Verification",
            mail: body.email,
            body: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
            eventType: "send_email"
        };

        await sqs.sendMessage({
            QueueUrl: EMAIL_QUEUE_URL!,
            MessageBody: JSON.stringify(messageToQueue),
        }).promise();


        return SuccessReponse(200);
    };

    public loginUser = async (body: Partial<IUser>): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const findUser = await new UserRepository().GetUserByMail(body.email!) as IUser || null;
        if (!findUser?._id) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "The email address provided is not registered.");
        }

        const isMatch = await bcrypt.compare(body.password!, findUser.password!);
        if (!isMatch) {
            throw new CustomError("Invalid Credentials!", StatusCodes.UNAUTHORIZED, "The password you entered is incorrect.");
        }

        const token = generateToken(findUser._id!, findUser.email, findUser.first_name, findUser.last_name);
        return SuccessReponse(200, token);
    };

    public emailVerifyUser = async (body: Partial<IUser>): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const findUser = await new UserRepository().GetUserByMail(body.email!) as IUser || null;
        if (!findUser?._id) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "Invalid email or user not registered.");
        }

        if (body.otp !== findUser.otp) {
            throw new CustomError("Invalid Otp!", StatusCodes.UNAUTHORIZED, "The OTP provided does not match.");
        }

        if (Date.now() > findUser.otpExpire.getTime()) {
            throw new CustomError("Otp Expired!", StatusCodes.CONFLICT, "The OTP has expired, please request a new one.");
        }

        await new UserRepository().UpdateUser({ emailVerified: true, _id: findUser._id });


        const messageToQueue = {
            subject: "OTP Verification",
            mail: findUser.email,
            body: `HEllo ${findUser.first_name}-${findUser.last_name}.
            Thank you to joining us.
            `,
            eventType: "send_email"
        };

        await sqs.sendMessage({
            QueueUrl: EMAIL_QUEUE_URL!,
            MessageBody: JSON.stringify(messageToQueue),
        }).promise();

        return SuccessReponse(200);
    };

    public forgetPassword = async (body: Partial<IUser>): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const findUser = await new UserRepository().GetUserByMail(body.email!) as IUser || null;
        if (!findUser?._id) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "The email address provided is not registered.");
        }
        const otp = generateOTP(6);

        const dataToSend: IUser = {
            ...findUser,
            _id: findUser._id,
            otp,
            otpExpire: new Date(Date.now() + 15 * 60 * 10000)
        }
        const user = await new UserRepository().UpdateUser(dataToSend);
        const messageToQueue = {
            subject: "Forget Password",
            mail: findUser.email,
            body: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
            eventType: "send_email"
        };

        await sqs.sendMessage({
            QueueUrl: EMAIL_QUEUE_URL!,
            MessageBody: JSON.stringify(messageToQueue),
        }).promise();
        return SuccessReponse(200);
    };

    public resetPassword = async (body: Partial<IUser>): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const findUser = await new UserRepository().GetUserByMail(body.email!) as IUser || null;
        if (!findUser?._id) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "The email address provided is not registered.");
        }

        if (body.otp !== findUser.otp) {
            throw new CustomError("Invalid Otp!", StatusCodes.UNAUTHORIZED, "The OTP provided does not match.");
        }

        if (Date.now() > findUser.otpExpire.getTime()) {
            throw new CustomError("Otp Expired!", StatusCodes.CONFLICT, "The OTP has expired, please request a new one.");
        }

        const dataToSend: IUser = {
            ...findUser,
            _id: findUser._id,
            password: body.password!
        }
        const user = await new UserRepository().UpdateUser(dataToSend);

        return SuccessReponse(200);
    };

    public updateUser = async (body: Partial<IUser>, token: string): Promise<APIGatewayProxyResult> => {
        await dbConnect();
        const decoded = await verifyToken(token);

        const userId = decoded.decoded._id;
        const user = await new UserRepository().GetUserById(userId!);
        if (!user) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "The user ID from the token is invalid.");
        }

        const updatedUser = await new UserRepository().UpdateUser({ ...body, _id: userId });
        return SuccessReponse(200);
    };

    public getUserDetails = async (token: any): Promise<APIGatewayProxyResult> => {
        await dbConnect();

        const decoded = (await verifyToken(token)).decoded;
        const userId = decoded._id;
        if (!userId) {
            throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED, "Unauthorized, invalid token");
        }
        const user = await new UserRepository().GetUserById(userId!);

        const data: Partial<IUser> = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            emailVerified: user.emailVerified
        };

        if (!user) {
            throw new CustomError("User Not Found!", StatusCodes.NOT_FOUND, "The user ID from the token is invalid.");
        }

        return SuccessReponse(200, data);
    };
}

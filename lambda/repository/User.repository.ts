import { CustomError } from "../Error/ErrorHandler";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User.schema";
const {StatusCodes} =require('http-status-codes');
const bcrypt = require('bcrypt');

export class UserRepository {
    public RegisterUser = async (user: IUser): Promise<IUser> => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            const newUser = new User({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: hashedPassword,
                emailVerified: user.emailVerified,
                otp: user.otp,
                otpExpire: user.otpExpire,
            });

            await newUser.save();
            return newUser;

        } catch (error: any) {
            if (error instanceof CustomError) {
                throw new CustomError(error.message, error.statusCode, error.details);
            }
            throw new CustomError("Error registering user", StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    };

    public UpdateUser = async (user: Partial<IUser>): Promise<IUser> => {
        try {
            const userToUpdate = await User.findById(user._id);
            if (!userToUpdate) {
                throw new CustomError("User not found", StatusCodes.NOT_FOUND, "No user found with the provided ID.");
            }

            // Update user fields if provided
            if (user.first_name) userToUpdate.first_name = user.first_name;
            if (user.last_name) userToUpdate.last_name = user.last_name;
            if (user.email) userToUpdate.email = user.email;
            if (user.emailVerified) userToUpdate.emailVerified = user.emailVerified; // Check for undefined
            if (user.otp) userToUpdate.otp = user.otp;
            if (user.otpExpire) userToUpdate.otpExpire = user.otpExpire;

            // Handle password update
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                userToUpdate.password = await bcrypt.hash(user.password, salt);
            }

            await userToUpdate.save();
            return userToUpdate;

        } catch (error: any) {
            throw new CustomError("Error updating user", StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    };

    public GetUserById = async (id: string): Promise<IUser> => {
        const user = await User.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND, "No user found with the provided ID.");
        }
        return user;
    };

    public GetUserByMail = async (email: string): Promise<IUser | null> => {
        return await User.findOne({ email });
    };
}

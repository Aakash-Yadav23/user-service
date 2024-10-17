import { CustomError } from "../Error/ErrorHandler";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User.schema";
const {StatusCodes} =require('http-status-codes');
const bcrypt = require("bcrypt");

export class UserRepository {
    public RegisterUser = async (user: IUser): Promise<IUser> => {

        try {
            const checkIfUserExists = await User.findOne({ email: user.email });

            if (checkIfUserExists) {
                throw new CustomError("Email already Used!", StatusCodes.CONFLICT);
            };

            const userCreate = new User({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,

            });

            await userCreate.save();
            return userCreate;


        } catch (error: any) {

            if (error instanceof CustomError) {

                throw new CustomError(

                    error.message,
                    error.statusCode,
                )

            }
            throw new CustomError(error.message);

        }
    };

    public UpdateUser = async (user: Partial<IUser>) => {
        const userToUpdate = await User.findById(user._id);
        
        if (!userToUpdate) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }

        if (user.first_name) userToUpdate.first_name = user.first_name;
        if (user.last_name) userToUpdate.last_name = user.last_name;
        if (user.email) userToUpdate.email = user.email;

        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            userToUpdate.password = await bcrypt.hash(user.password, salt);
        };

        await userToUpdate.save();
        return userToUpdate;

    };

    public GetUserById = async (id: any) => {
        const user = await User.findById(id);
        
        if (!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        };

        return user;

    };


    public GetUserByMail = async (email: string) => {
        const checkIfUserExists = await User.find({ email: email });

        return checkIfUserExists;

    };

}
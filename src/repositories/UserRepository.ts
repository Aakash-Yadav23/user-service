import { CustomError } from "../handlers/CustomError";
import { IUser } from "../interfaces/IUser"
import { loginUserDto, registerUserDto } from "../model/dto/User.dto";
import httpStatusCode from "http-status-codes";
import { UserModel } from "../model/MUser";

export class UserRepository {

    public RegisterUser = async (userData: IUser): Promise<IUser> => {

        const userDataToCreate: IUser = {
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            email: userData.email!,
            password: userData.password!,
            otp: userData.otp,
            otpExpireDate: userData.otpExpireDate,
            isVerified: userData.isVerified!,
            isDeleted: userData.isDeleted,
            isSuspended: userData.isSuspended,
            device: userData.device!,
            dateOfBirth: userData.dateOfBirth!,
            age: userData.age!
        }

        const createUser = await UserModel.create(userDataToCreate);
        return createUser;
    }

    public loginUser = async (userData: Partial<IUser>) => {

        const { error } = loginUserDto.validate(userData);


        if (error) {
            throw new CustomError(error.details[0].message, httpStatusCode.EXPECTATION_FAILED)
        };

        return { message: "User Login successfully!" };
    }


    public getUserByEmail = async (mail: string): Promise<IUser | null> => {
        return await UserModel.findOne({ email: mail });
    }


    public getUserById = async (id: string): Promise<IUser | null> => {
        return await UserModel.findById(id).populate({
            path:"addressIds",
            select: 'street city state zipCode country', 

        });
    }


    public updateUser = async (userData: Partial<IUser>): Promise<IUser> => {
        console.log("userData", userData)

        const user = await UserModel.findById(userData.id!);
        console.log("User", user)
        if (!user) {
            throw new CustomError("User Not found", httpStatusCode.NOT_FOUND)
        }

        if (userData.firstName) user.firstName = userData.firstName;
        if (userData.lastName) user.lastName = userData.lastName;
        if (userData.profilePic) user.profilePic = userData.profilePic;
        if (userData.otp) user.otp = userData.otp;
        if (userData.otpExpireDate) user.otpExpireDate = userData.otpExpireDate;
        if (userData.device) user.device = userData.device;
        if (userData.lastLogin) user.lastLogin = userData.lastLogin;
        if (userData.isDeleted) user.isDeleted = userData.isDeleted;
        if (userData.isSuspended) user.isSuspended = userData.isSuspended;
        if (userData.isVerified) user.isVerified = userData.isVerified;
        if (userData.email) user.email = userData.email;
        if (userData.password) user.password = userData.password;
        if (userData.addressIds) user.addressIds = userData.addressIds;


        await user.save();
        return user;
    }

}
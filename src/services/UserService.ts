import { CustomError } from "../handlers/CustomError";
import { IUser } from "../interfaces/IUser"
import { loginUserDto, registerUserDto } from "../model/dto/User.dto";
import httpStatusCode from "http-status-codes";
import { UserRepository } from "../repositories/UserRepository";
import { generateOtp } from "../utils/utils";
import { comparePassword, generateToken, hashPassword } from "../utils/password";

export class UserService {

    public userRepository = new UserRepository();

    public RegisterUser = async (userData: Partial<IUser>) => {
        try {
            console.log("userData", userData)


            const { value, error } = registerUserDto.validate(userData);

            if (error) {
                throw new CustomError(error.details[0].message, httpStatusCode.EXPECTATION_FAILED)
            };

            const dateOfBirth = new Date(value.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dateOfBirth.getFullYear();
            const monthDiff = today.getMonth() - dateOfBirth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
                age--;
            }

            const isUserExistsWithMailOrNot = await this.userRepository.getUserByEmail(value.email!);

            if (isUserExistsWithMailOrNot) {
                throw new CustomError("Email Already Used", httpStatusCode.CONFLICT)
            }

            const hashedPassword = await hashPassword(value.password)

            const userDataToCreate: IUser = {
                firstName: value.firstName!,
                lastName: value.lastName!,
                email: value.email!,
                password: hashedPassword,
                otp: generateOtp(6).otp,
                otpExpireDate: generateOtp(6).otpExpiryDate,
                isVerified: false,
                dateOfBirth: value.dateOfBirth!,
                isDeleted: false,
                isSuspended: false,
                device: value.device!,
                age: age + ""
            }

            return await this.userRepository.RegisterUser(userDataToCreate);

        } catch (error: any) {
            if (error instanceof CustomError) {

                throw new CustomError(error.message, error.code, error.details)
            }
            throw new CustomError(error.message, 500)
        }
    }

    public loginUser = async (userData: Partial<IUser>) => {

        try {

            const { value, error } = loginUserDto.validate(userData);


            if (error) {
                throw new CustomError(error.details[0].message, httpStatusCode.EXPECTATION_FAILED)
            };

            const isUserExistsWithMailOrNot = await this.userRepository.getUserByEmail(value.email!);


            if (!isUserExistsWithMailOrNot) {
                throw new CustomError("User not found with this mail", httpStatusCode.NOT_FOUND)
            };


            if (isUserExistsWithMailOrNot.isDeleted) {
                throw new CustomError("User Deleted", httpStatusCode.MOVED_PERMANENTLY)
            };

            if (isUserExistsWithMailOrNot.isSuspended) {
                throw new CustomError("Your account has been suspended.contact support for queries", httpStatusCode.FORBIDDEN)
            }


            const isCorrectPassword = await comparePassword(value.password, isUserExistsWithMailOrNot.password)
            if (!isCorrectPassword) {
                throw new CustomError("Invalid Credentials", httpStatusCode.UNAUTHORIZED);
            }

            console.log("isCorrectPassword", isCorrectPassword)
            const token = generateToken(isUserExistsWithMailOrNot.id!);


            await this.userRepository.updateUser({
                id: isUserExistsWithMailOrNot.id,
                lastLogin: new Date(Date.now()).toISOString()
            })



            return token;

        } catch (error: any) {
            if (error instanceof CustomError) {

                throw new CustomError(error.message, error.code, error.details)
            }
            throw new CustomError(error.message, 500)
        }
    };


    public GetMe = async (id: string) => {
        try {

            const findUserById = await this.userRepository.getUserById(id!);
            console.log("findUserById", findUserById)
            if (!findUserById) {
                throw new CustomError("User not found with this mail", httpStatusCode.NOT_FOUND)
            };

            return findUserById;

        } catch (error: any) {
            if (error instanceof CustomError) {

                throw new CustomError(error.message, error.code, error.details)
            }
            throw new CustomError(error.message, 500)
        }
    };

}
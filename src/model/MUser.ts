import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { hashPassword } from "../utils/password";

interface IUserDocument extends IUser, Document {
    _id: string;
};


const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    profilePic: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpireDate: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    lastLogin: { type: String, default: null },
    device: { type: String, default: null },
});



UserSchema.pre<IUserDocument>("save", async function (next) {
    try {

        this.password = await hashPassword(this.password);
        next();

    } catch (error:any) {
        next(error);

    }
});



export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);


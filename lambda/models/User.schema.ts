import mongoose from "mongoose";
const bcrypt =require('bcrypt');


import { IUser } from "../interfaces/IUser";


const userSchema = new mongoose.Schema<IUser>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {

    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error:any) {
        next(error);
    }
})

export const User = mongoose.model<IUser>("User", userSchema);

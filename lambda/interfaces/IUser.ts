import { Document } from "mongoose";

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}


export interface ISession {
    session_id: string;
    user_id: string;
    email: string;
    created_at: string;
    last_accessed: string;
}
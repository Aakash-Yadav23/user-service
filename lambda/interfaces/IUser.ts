
export interface IUser  {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    emailVerified: boolean,
    otp: string,
    otpExpire: Date
}


export interface ISession {
    session_id: string;
    user_id: string;
    email: string;
    created_at: string;
    last_accessed: string;
}
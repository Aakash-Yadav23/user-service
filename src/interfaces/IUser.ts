export interface IUser{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    profilePic?:string;
    otp?:string;
    otpExpireDate?:Date;
    isVerified:boolean;
    isDelted:boolean;
    isSuspended:boolean;
    lastLogin:Date;
    device:string;
}
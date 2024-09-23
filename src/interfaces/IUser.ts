export interface IUser{
    id?:string;
    firstName:string;
    lastName:string;
    password:string;
    email:string;
    dateOfBirth:string;
    age:string;
    profilePic?:string;
    addressIds?:string[]
    otp?:string;
    otpExpireDate?:string;
    isVerified:boolean;
    isDeleted:boolean;
    isSuspended:boolean;
    lastLogin?:string;
    device:string;
}
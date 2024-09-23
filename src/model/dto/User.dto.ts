import Joi from "joi";


export const registerUserDto=Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    dateOfBirth: Joi.string().isoDate().required().label("Date Of Birth"),
    email: Joi.string().email().min(3).required().label("Email Address"),
    password: Joi.string().min(8).required().label("Password"),
    profilePic: Joi.string().min(3).label("Profile Pic"),
    device: Joi.string().min(3).label("Device"),
});



export const loginUserDto=Joi.object({
    email: Joi.string().email().min(3).required().label("Email Address"),
    password: Joi.string().min(8).required().label("Password"),
});


export const verifyOtpUserDto=Joi.object({
    email: Joi.string().email().min(3).required().label("Email Address"),
    password: Joi.string().min(3).required().label("Password"),
    otp: Joi.string().min(6).required().label("Otp"),
});



export const updateUserProfilePic=Joi.object({
    profilePic: Joi.string().min(3).label("Profile Pic"),
});


export const updateUserProfile=Joi.object({
    firstName: Joi.string().min(3).label("First Name"),
    lastName: Joi.string().min(3).label("Last Name"),
    dateOfBirth: Joi.string().isoDate().label("Last Name"),
    password: Joi.string().min(8).label("Password"),
})
const Joi = require('joi');




export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(2).required(),
});

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    otp: Joi.string().min(6).required(),
});

export const emailVerifySchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});


export const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    // password: Joi.string().min(6).required(),
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(2).required(),
});
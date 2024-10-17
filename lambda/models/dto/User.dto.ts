const Joi = require('joi');



export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().email().required(),
    first_name: Joi.string().email().required(),
    last_name: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().email().required(),
});


export const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().email().required(),
    first_name: Joi.string().email().required(),
    last_name: Joi.string().email().required(),
});
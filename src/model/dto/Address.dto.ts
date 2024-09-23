import Joi from "joi";

// DTO for creating an address
export const createAddressDto = Joi.object({
    street: Joi.string().required().label("Street"),
    city: Joi.string().required().label("City"),
    state: Joi.string().required().label("State"),
    zipCode: Joi.string().required().label("Zip Code"),
    country: Joi.string().required().label("Country"),
    userId: Joi.string().required().label("User ID"), // assuming you want to associate the address with a user
});

// DTO for updating an address
export const updateAddressDto = Joi.object({
    street: Joi.string().label("Street"),
    city: Joi.string().label("City"),
    state: Joi.string().label("State"),
    zipCode: Joi.string().label("Zip Code"),
    country: Joi.string().label("Country"),
});

// DTO for getting an address by ID (no validation needed, but can be used to enforce the ID type)
export const getAddressDto = Joi.object({
    id: Joi.string().required().label("Address ID"),
});

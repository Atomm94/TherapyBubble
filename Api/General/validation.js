import Joi from "joi";
const validator = require('express-joi-validation').createValidator({})

const login = Joi.object({
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required().min(3).max(15).trim()
})

const sendEmailCode = Joi.object({
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required()
})

const loginValidation = validator.body(login);
const sendEmailCodeValidation = validator.body(sendEmailCode);

export {
    loginValidation,
    sendEmailCodeValidation
}
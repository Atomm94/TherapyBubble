import Joi from 'joi';
import {categories, sessionFormat, therapistServices, validCountry} from "../../Helpers/constant";
const validator = require('express-joi-validation').createValidator({})

const registerStepOne = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required().min(3).max(15).trim(),
    confirmPass: Joi.string().required().min(3).max(15).trim(),
    digitNumber: Joi.string().required().length(6).trim()
})


const registerStepTwo = Joi.object({
    phoneNumber: Joi.string().required(),
    country: Joi.string().valid(...Object.values(validCountry)).required(),
    businessName: Joi.string()
})

const registerStepThree = Joi.object({
    services: Joi.string().valid(...Object.values(therapistServices)),
    certificate: Joi.string().required(),
    postCode: Joi.string(), //postCode
    sessionFormat: Joi.string().valid(...Object.values(sessionFormat)),
    yearsOfExp: Joi.string(), //years of experience
    profBody: Joi.string(), // who is your professional governing body?
})

const productSchema = Joi.object({
    name: Joi.string().required(),
    productInfo: Joi.string(),
    price: Joi.number().required(),
    photos: Joi.array().items(Joi.string()),
    CC_certificate: Joi.string(),
    CC_link: Joi.string(),
    COSHH_certificate: Joi.string(),
    category: Joi.string().valid(...Object.keys(categories))
})

const giftCardSchema = Joi.object({
    name: Joi.string().required(),
    giftInfo: Joi.string(),
    price: Joi.number().required()
})

const addNewCardSchema = Joi.object({

})

const stepOneValidation = validator.body(registerStepOne);
const stepTwoValidation = validator.body(registerStepTwo);
const finishStepValidation = validator.body(registerStepThree);
const productValidation = validator.body(productSchema);
const giftValidation = validator.body(giftCardSchema);

export {
    stepOneValidation,
    stepTwoValidation,
    finishStepValidation,
    productValidation,
    giftValidation
}
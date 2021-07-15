import express from'express';
import jwt from'jsonwebtoken';
import * as config from '../config';
import {successHandler, errorHandler, errorHandlerAuth} from "./responseFunctions";
import userModel from "../Models/User";
import {error, Steps} from "./constant";
import jsonwebtoken from "jsonwebtoken";
import therapistModel from "../Models/Therapist";
import adminModel from "../Models/Admin";
const tokenUser = express();
const tokenAdmin = express();
const tokenTherapist = express();

tokenTherapist.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        res.user = await jsonwebtoken.decode(jwtAuth);
        let role = res.user.data.role;
        if (role !== 'therapist'){
            error.message = 'therapist is not find!';
            return errorHandlerAuth(res, error)
        }
        next()
    })
})

tokenAdmin.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        res.user = await jsonwebtoken.decode(jwtAuth);
        let role = res.user.data.role;
        if (role !== 'admin'){
            error.message = 'admin is not find!';
            return errorHandlerAuth(res, error)
        }
        next()
    })
})

tokenUser.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        res.user = await jsonwebtoken.decode(jwtAuth);
        let role = res.user.data.role;
        if (role !== 'user'){
            error.message = 'user is not find!';
            return errorHandlerAuth(res, error)
        }
        next()
    })
})


const createJwtToken = async (data, expire) => {
    let getToken = await jwt.sign({data: data}, process.env.JWT_SECRET_KEY);
    if (expire) {
        getToken = await jwt.sign({data: data}, process.env.JWT_SECRET_KEY, {
            expiresIn: expire
        });
    }
    return getToken;
}


export {
    tokenTherapist,
    createJwtToken,
    tokenAdmin,
    tokenUser
}

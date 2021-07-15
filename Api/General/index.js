import userModel from "../../Models/User";
import {error, Steps} from "../../Helpers/constant";
import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {comparePassword, hashPassword} from "../../Helpers/passwordHash";
import {createJwtToken} from "../../Helpers/auth";
import therapistModel from "../../Models/Therapist";
import adminModel from "../../Models/Admin";

const login = async (req, res) => {
    try {
        let role;
        let tok, sendObj = {}
        let findModelWithEmail;
        const { email, password } = req.body;
        findModelWithEmail = await userModel.findOne({email: email, delete: false});
        role = 'user';
        if (!findModelWithEmail) {
            findModelWithEmail = await therapistModel.findOne({email: email, delete: false, step: Steps.FINISH});
            role = 'therapist';
            if (!findModelWithEmail) {
                findModelWithEmail = await adminModel.findOne({email: email, delete: false});
                role = 'admin';
                if (!findModelWithEmail) {
                    error.message = 'Therapist/User/Admin is not find!';
                    return errorHandler(res, error);
                }
            }
        }
        const compare = await comparePassword(password, findModelWithEmail.password);
        if (!compare) {
            error.message = 'Password is not correct!';
            return errorHandler(res, error);
        }
        tok = {
            id: findModelWithEmail._id,
            role: role
        }
        let token = await createJwtToken(tok);
        sendObj = {
            Data: findModelWithEmail,
            Token: token
        }
        res.message = 'You are login successfully!';
        return successHandler(res, sendObj);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const verifyCode = async (req, res) => {
    try {
        const body = req.body;
        const { code } = req.query;
        let findModelWithEmail;

        findModelWithEmail = await userModel.findOne({email: body.email, delete: false});
        if (!findModelWithEmail) {
            findModelWithEmail = await therapistModel.findOne({email: body.email, delete: false, step: Steps.FINISH});
            if (!findModelWithEmail) {
                error.message = 'Therapist or User is not find!';
                return errorHandler(res, error);
            }
        }

        const compare = await comparePassword(body.digitNumber, code);
        if (!compare) {
            error.message = 'Your verification code is not valid!';
            return errorHandler(res, error);
        }
        res.message = "You are verified successfully!";
        return successHandler(res, findModelWithEmail);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const changePassword = async (req, res) => {
    try {
        let { password, confirmPassword } = req.body;
        const { personId } = req.query;
        let updatePerson;
        if (password !== confirmPassword) {
            error.message = "password and confirm password is not match!"
            return errorHandler(res, error)
        }
        password = await hashPassword(password);
        updatePerson = await therapistModel.updateOne({_id: personId}, {
            $set: {password: password, updatedAt: Date.now()}
        })
        if (updatePerson.nModified === 0) {
            updatePerson = await userModel.updateOne({_id: personId}, {
                $set: {password: password, updatedAt: Date.now()}
            })
            if (updatePerson.nModified === 0) {
                error.message = "User or Therapist is not find!";
                return errorHandler(res, error);
            }
        }
        res.message = "password reset successfully!";
        return successHandler(res, Date.now())
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    login,
    verifyCode,
    changePassword
}
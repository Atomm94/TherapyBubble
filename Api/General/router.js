import express from 'express';
const general = express();
import * as controllers from './index';
import * as validation from './validation';
import {SendEmailCode} from "../../Helpers/helpFunctions";


general.post('/sendEmailCode', validation.sendEmailCodeValidation, SendEmailCode);
general.post('/login', validation.loginValidation, controllers.login);
general.put('/log/verifyForReset', controllers.verifyCode);
general.put('/log/changePassword', controllers.changePassword);

export default general;
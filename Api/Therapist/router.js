import express from 'express';
const therapist = express();
import multer from 'multer';
import * as controllers from './index';
import * as validation from './validation';
import {fileFilter, storage} from "../../Helpers/uploadFiles";
import Joi from "joi";
const upload = multer({ storage: storage, fileFilter: fileFilter })
    .fields([{
        name: 'photos', maxCount: 4
    },{
        name: 'CC_certificate', maxCount: 1
    }, {
        name: 'COSHH_certificate', maxCount: 1,
    }]);

therapist.get('/log/getYourCreditCard', controllers.retrieveCard);
therapist.get('/log/getYourGiftCards', controllers.getYourGiftCards);
therapist.post('/registerStepOne', validation.stepOneValidation, controllers.registerStepOne);
therapist.post('/registerStepTwo', validation.stepTwoValidation, controllers.registerStepTwo);
therapist.post('/registerFinishStep', validation.finishStepValidation, controllers.registerFinishStep);
therapist.post('/log/addProduct', upload, controllers.addProduct);
therapist.post('/log/addGiftCard', validation.giftValidation, controllers.addGiftCards);
therapist.post('/log/addNewCard', controllers.addNewCard);
therapist.put('/log/newOrder', controllers.newOrder);

export default therapist;
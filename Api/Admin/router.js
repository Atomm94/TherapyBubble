import express from 'express';
const admin = express();
import multer from 'multer';
import * as controllers from './index';
import * as validation from './validation';

admin.get('/log/getProductsForCheck', controllers.getProductsForCheck);
admin.post('/register', validation.registerValidation, controllers.register);
admin.put('/log/checkProduct', controllers.checkProduct);

export default admin;
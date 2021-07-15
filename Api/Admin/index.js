import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {hashPassword} from "../../Helpers/passwordHash";
import adminModel from "../../Models/Admin";
import jsonwebtoken from 'jsonwebtoken';
import productModel from "../../Models/Product";
import {error} from "../../Helpers/constant";

const register = async (req, res) => {
    try {
        const body = req.body;
        body.password = await hashPassword(body.password);
        const createAdmin = await adminModel.create(body);
        res.message = 'Admin is register successfully!';
        return successHandler(res, createAdmin);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const getProductsForCheck = async (req, res) => {
    try {
        const findAllUncheckedProducts = await productModel.find({checked: false})
        res.message = 'All unchecked products!';
        return successHandler(res, findAllUncheckedProducts);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const checkProduct = async (req, res) => {
    try {
        const { productId } = req.query;
        const checkProduct = await productModel.updateOne({_id: productId, checked: false}, {
            $set: {checked: true}
        });
        res.message = 'You check this product!';
        return successHandler(res, null)
    } catch (err) {
        return errorHandler(res, err);
    }
}

/** uncheck product and send the reason **/

export {
    register,
    getProductsForCheck,
    checkProduct
}
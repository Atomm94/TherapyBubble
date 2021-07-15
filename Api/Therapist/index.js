import therapistModel from "../../Models/Therapist";
import {categories, error, productsType, Steps} from "../../Helpers/constant";
import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {comparePassword, hashPassword} from "../../Helpers/passwordHash";
import jsonwebtoken from "jsonwebtoken";
const fs = require('fs');
import productModel from "../../Models/Product";
import giftModel from "../../Models/giftCard";
import {stripe} from "../../config";
import {addNewCardToPerson, doPayment, retrieveCreditCard} from "../../Helpers/paymentServices";
let dataFiles;

const registerStepOne = async (req, res) => {
    try {
        const body = req.body;
        const { code } = req.query;
        const findTherapistWithEmail = await therapistModel.findOne({email: body.email, delete: false});
        if (findTherapistWithEmail) {
            if (findTherapistWithEmail.step === 'finish') {
                error.message = 'The email must be unique';
            } else {
                error.message = `You can stay on step ${findTherapistWithEmail.step}, please continue.`
            }
            return errorHandler(res, error);
        }
        if (body.password !== body.confirmPass) {
            error.message = 'password & confirm password is not match!';
            return errorHandler(res, error);
        }
        const compare = await comparePassword(body.digitNumber, code)
        if (!compare) {
            error.message = 'Your verification code is not valid!';
            return errorHandler(res, error);
        }
        body.step = Steps.ONE
        body.password = await hashPassword(body.password);
        const createTherapistStepOne = await therapistModel.create(body);
        res.message = 'In step one therapist registered successfully!';
        return successHandler(res, createTherapistStepOne);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const registerStepTwo = async (req, res) => {
    try {
        const { userId } = req.query;
        const body = req.body;
        body.step = Steps.TWO;
        const createTherapistStepTwo = await therapistModel.updateOne({_id: userId}, body);
        res.message = 'In step two therapist registered successfully!';
        return successHandler(res, userId);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const registerFinishStep = async (req, res) => {
    try {
        const { userId } = req.query;
        const body = req.body;
        body.step = Steps.FINISH;
        body.createdAt = Date.now();
        const createTherapistStepThree = await therapistModel.updateOne({_id: userId}, body);
        const findTherapist = await therapistModel.findOne({_id: userId});
        res.message = 'In finish step therapist registered successfully!';
        return successHandler(res, findTherapist);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const addProduct = async (req, res) => {
    try {
        const body = req.body;
        if (req.files) {
            let fullUrl = req.protocol + '://' + req.get('host');
            if (req.files.photos) {
                let photos = [];
                req.files.photos.map(item => {
                    item = fullUrl + '/' + item.filename
                    photos.push(item)
                })
                body.photos = photos;
            }
            body.CC_certificate = req.files.CC_certificate ? fullUrl + '/' + req.files.CC_certificate[0].filename : null;
            body.COSHH_certificate = req.files.COSHH_certificate ? fullUrl + '/' + req.files.COSHH_certificate[0].filename : null;
        }
        dataFiles = fs.readdirSync('Media');
        if (categories[body.category] === true) {
            body.checked = false;
        } else {
            body.checked = true
        }
        body.therapist = res.user.data.id;
        const createProduct = await productModel.create(body);
        res.message = 'You add this product to your products!';
        await therapistModel.updateOne({_id: res.user.data.id, delete: false, step: Steps.FINISH}, {
            $set: {products: createProduct._id}
        })
        return successHandler(res, createProduct);
    } catch (err) {
        if (req.files) {
            dataFiles = fs.readdirSync('Media');
            let index;
            if (req.files.photos) {
                req.files.photos.map(async item => {
                    if (dataFiles.includes(item.filename)) {
                        index = dataFiles.indexOf(item.filename)
                        await fs.unlinkSync(`Media/${dataFiles[index]}`);
                    }
                })
            }
            if (req.files.CC_certificate) {
                if (dataFiles.includes(req.files.CC_certificate.filename)) {
                    index = dataFiles.indexOf(req.files.CC_certificate.filename)
                    await fs.unlinkSync(`Media/${dataFiles[index]}`);
                }
            }
            if (req.files.COSHH_certificate) {
                if (dataFiles.includes(req.files.COSHH_certificate.filename)) {
                    index = dataFiles.indexOf(req.files.COSHH_certificate.filename)
                    await fs.unlinkSync(`Media/${dataFiles[index]}`);
                }
            }
        }
        return errorHandler(res, err);
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.query;

    } catch (err) {
        return errorHandler(res, err);
    }
}

const addGiftCards = async (req, res) => {
    try {
        const body = req.body;
        body.therapist = res.user.data.id;
        const createGiftCard = await giftModel.create(body);
        res.message = 'You add gift card in your gift cards page!';
        await therapistModel.updateOne({_id: res.user.data.id, delete: false}, {
            $push: {giftCards: createGiftCard._id}
        })
        return successHandler(res, createGiftCard);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const getYourGiftCards = async (req, res) => {
    try {
        const findGiftCards = await giftModel.find({therapist: res.user.data.id});
        res.message = 'Your all gift cards!';
        return successHandler(res, findGiftCards);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const addNewCard = async (req, res) => {
    try {
        const body = req.body;
        const findTherapist = await therapistModel.findOne({_id: res.user.data.id, delete: false, step: Steps.FINISH});
        const creditCard = await addNewCardToPerson(body, findTherapist.email)
        await therapistModel.updateOne({_id: res.user.data.id, delete: false, step: Steps.FINISH}, {
            $set: {'credit_card.cardId': creditCard.id, 'credit_card.customer': creditCard.customer}
        })
        return successHandler(res, creditCard);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const retrieveCard = async (req, res) => {
    try {
        const findTherapist = await therapistModel.findOne({_id: res.user.data.id, delete: false, step: Steps.FINISH});
        const retrieveYourCard = await retrieveCreditCard(findTherapist.credit_card.customer, findTherapist.credit_card.cardId);
        res.message = 'Your credit card!';
        return successHandler(res, retrieveYourCard);
    } catch (err) {
        return successHandler(res, err);
    }
}

// const buyProduct = async (req, res) => {
//     try {
//         const { productId } = req.query;
//         const findTherapist = await therapistModel.findOne({_id: res.user.data.id, delete: false, step: Steps.FINISH});
//         const findProduct = await productModel.findOne({_id: productId});
//         if (!findProduct) {
//             error.message = 'Product is not find!';
//             return errorHandler(res, error);
//         }
//         let payment = await doPayment(
//             findProduct.price,
//             'therapist',
//             productsType.PRODUCT,
//             res.user.data.id,
//             findTherapist.email,
//             findTherapist.credit_card.customer,
//             findTherapist.credit_card.cardId
//         )
//         await therapistModel.updateOne({_id: res.user.data.id, delete: false, step: Steps.FINISH}, {
//             $push: {orders: payment._id}
//         })
//         res.message = 'You bought new product!';
//         return successHandler(res, payment);
//     } catch (err) {
//         return errorHandler(res, err);
//     }
// }

const newOrder = async (req, res) => {
    try {
        let findProduct, productType;
        const query = req.query;
        const findTherapist = await therapistModel.findOne({_id: res.user.data.id, delete: false, step: Steps.FINISH});
        if (query.productId) {
            findProduct = await productModel.findOne({_id: query.productId});
            if (!findProduct) {
                error.message = 'Product is not find!';
                return errorHandler(res, error);
            }
            productType = productsType.PRODUCT;
            res.message = 'You bought new product!';
        } else if(query.giftId) {
            findProduct = await giftModel.findOne({_id: query.giftId});
            if (!findProduct) {
                error.message = 'Gift card is not find!';
                return errorHandler(res, error);
            }
            productType = productsType.GIFT_CARD;
            res.message = 'You bought new gift card!';
        } else {
            findProduct = await giftModel.findOne({_id: query.packageId});
            if (!findProduct) {
                error.message = 'Package is not find!';
                return errorHandler(res, error);
            }
            productType = productsType.PACKAGE;
            res.message = 'You bought new package!';
        }

        let payment = await doPayment(
            findProduct.price,
            'therapist',
            productType,
            res.user.data.id,
            findTherapist.email,
            findTherapist.credit_card.customer,
            findTherapist.credit_card.cardId
        )
        await therapistModel.updateOne({_id: res.user.data.id, delete: false, step: Steps.FINISH}, {
            $push: {orders: payment._id}
        })
        return successHandler(res, payment);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    registerStepOne,
    registerStepTwo,
    registerFinishStep,
    addProduct,
    addGiftCards,
    getYourGiftCards,
    addNewCard,
    retrieveCard,
    newOrder
}
import {stripe} from "../config";
import orderModel from "../Models/Order";
import {error} from "./constant";
import {errorHandler} from "./responseFunctions";

const addNewCardToPerson = async (body, email, res) => {
    const customer = await stripe.customers.create({email: email})
    if (!body.cardNumber || !body.cardExpMonth || !body.cardExpYear || !body.cardCVC) {
        return res.status(400).send({
            Error: 'Please Provide All Necessary Details to save the card'
        })
    }
    const cardToken = await stripe.tokens.create({
        card: {
            name: body.cardName,
            number: body.cardNumber,
            exp_month: body.cardExpMonth,
            exp_year: body.cardExpYear,
            cvc: body.cardCVC
        }
    })
    const card = await stripe.customers.createSource(customer.id, {
        source: `${cardToken.id}`
    })
    return card;
}

const retrieveCreditCard = async (customer, cardId) => {
    const retrieveCard = await stripe.customers.retrieveSource(
        `${customer}`,
        `${cardId}`
    );
    return retrieveCard;
}

const doPayment = async (price, role, productType, roleId, email, customer, cardId, res) => {
    const createCharge = await stripe.charges.create({
        amount: price * 100,
        currency: "usd",
        receipt_email: email,
        customer: customer,
        card: cardId,
        description: `Stripe Charge Of Amount ${price} for Payment`,
    });
    if (createCharge.status === "succeeded") {
        let order;
        if (role === 'therapist') {
            order = await orderModel.create({
                therapist: roleId,
                cardId: cardId,
                customer: customer,
                paymentId: createCharge.id,
                productType: productType,
                amount: price
            })
        } else {
            order = await orderModel.create({
                user: roleId,
                cardId: cardId,
                customer: customer,
                paymentId: createCharge.id,
                productType: productType,
                amount: price
            })
        }
        return order;
    } else {
        error.message = "Please try again later for payment";
        return errorHandler(res, error);
    }
}

export {
    addNewCardToPerson,
    retrieveCreditCard,
    doPayment
}
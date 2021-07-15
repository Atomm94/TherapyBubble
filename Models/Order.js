import {Schema, model} from 'mongoose';
import {productsType} from "../Helpers/constant";

const orderSchema = new Schema({
    giftCard: {
        type: Schema.Types.ObjectId,
        ref: 'giftCard'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    therapist: {
        type: Schema.Types.ObjectId,
        ref: 'therapist'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    productType: {
        type: String,
        enum: Object.values(productsType),
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    cardId: String,
    customer: String,
})

const orderModel = model('order', orderSchema);

export default orderModel;
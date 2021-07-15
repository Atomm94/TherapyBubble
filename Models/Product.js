import {Schema, model} from 'mongoose';
import {categories} from "../Helpers/constant";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    productInfo: String,
    price: {
        type: Number,
        required: true
    },
    photos: [String],
    CC_certificate: String,
    CC_link: String,
    COSHH_certificate: String,
    therapist: {
        type: Schema.Types.ObjectId,
        ref: 'therapist'
    },
    checked: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: Object.keys(categories),
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: Date
})

const productModel = model('product', productSchema);

export default productModel;
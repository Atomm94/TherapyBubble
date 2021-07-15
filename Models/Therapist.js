import { Schema, model } from 'mongoose';
import {
    sessionFormat,
    Steps,
    therapistServices,
} from "../Helpers/constant";

const therapistSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: String,
    country: String,
    businessName: String,
    age: Number,
    services: {
        type: String,
        enum: Object.values(therapistServices)
    },
    AvgSessFee: String,
    sessionFormat: {
        type: String,
        enum: Object.values(sessionFormat),
        default: sessionFormat.OFFLINE
    },
    step: {
        type: String,
        enum: Object.values(Steps),
        default: Steps.ONE
    },
    ageSpecialty: String,
    treatmentApp: String,
    appDescription: String,
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: "booking"
    }],
    delete: {
        type: Boolean,
        default: false
    },
    products: [{
       type: Schema.Types.ObjectId,
       ref: 'product'
    }],
    giftCards: [{
        type: Schema.Types.ObjectId,
        ref: 'giftCard'
    }],
    credit_card: {
        customer: String,
        cardId: String
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'order'
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: Date
})

const therapistModel = model('therapist', therapistSchema);

export default therapistModel;
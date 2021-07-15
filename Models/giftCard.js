import {Schema, model} from 'mongoose';

const giftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    giftInfo: String,
    price: {
        type: Number,
        required: true
    },
    therapist: {
        type: Schema.Types.ObjectId,
        ref: 'therapist'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: Date
})

const giftModel = model('giftCard', giftSchema);

export default giftModel;
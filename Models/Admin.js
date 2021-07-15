import {Schema, model} from 'mongoose';

const adminSchema = new Schema({
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
    delete: {
        type: Boolean,
        default: false
    }
})

const adminModel = model('admin', adminSchema);

export default adminModel;
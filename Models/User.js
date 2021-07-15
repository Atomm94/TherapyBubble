import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: String
})

const userModel = model('user', userSchema);

export default userModel;
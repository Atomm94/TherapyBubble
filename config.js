import env from 'dotenv';
import mongoose from 'mongoose';
env.config();

const Stripe_Key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(Stripe_Key);

mongoose.connect('mongodb+srv://At11:atmak11@cluster0.d1re6.mongodb.net/therapyBubble?retryWrites=true&w=majority', {
    useFindAndModify: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_ => console.log('Database connect successfully!'))
    .catch(err => console.log(`Database connect error: ${err}`))

export {
    stripe
}
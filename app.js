import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as config from './config';
import route from "./Api/routes";
import {tokenTherapist,tokenUser,tokenAdmin} from "./Helpers/auth";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/Media'));


app.use('/api/therapist/log', tokenTherapist);
app.use('/api/admin/log', tokenAdmin);
app.use('/api/user/log', tokenUser);
app.use('/api', route)

app.listen(port, () => {
    console.log(`Server started with port ${port}`);
})
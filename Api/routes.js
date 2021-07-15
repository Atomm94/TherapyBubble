import { Router } from 'express';
import therapist from "./Therapist/router";
import general from "./General/router";
import admin from "./Admin/router";
const route = Router();

route.use('/therapist', therapist);
route.use('/general', general);
route.use('/admin', admin);

export default route;
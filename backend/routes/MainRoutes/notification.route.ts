import { Router } from 'express';
import {   
    postNotification,
    getAllNotification
} from '../../controllers/index';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';

const GeneralRouter = Router();

GeneralRouter.get('/all', HospitalMiddleware, getAllNotification);
GeneralRouter.get('/new', HospitalMiddleware, postNotification );

export { GeneralRouter };

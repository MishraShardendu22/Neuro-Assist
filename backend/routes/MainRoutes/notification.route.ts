import { Router } from 'express';
import { postNotification, getAllNotification } from '../../controllers/index';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';

const NotificationRouter = Router();

NotificationRouter.post('/new', HospitalMiddleware, postNotification);

NotificationRouter.get('/all', HospitalMiddleware, getAllNotification);

export { NotificationRouter };

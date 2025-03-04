import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import { login, register, verifyHospital, emergencyActivate } from '../../controllers/index';

const HospitalRouter = Router();

HospitalRouter.get('/verifyHospital', HospitalMiddleware, verifyHospital);

HospitalRouter.post('/login', login);
HospitalRouter.post('/register', register);
HospitalRouter.post('/emergencyActivate', HospitalMiddleware, emergencyActivate);

export { HospitalRouter };

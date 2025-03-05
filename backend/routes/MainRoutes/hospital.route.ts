import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import { login, register, verifyHospital, emergencyActivate,getAllPatients } from '../../controllers/index';

const HospitalRouter = Router();

HospitalRouter.get('/getPatients', HospitalMiddleware,getAllPatients);
HospitalRouter.get('/verifyHospital', HospitalMiddleware, verifyHospital);

HospitalRouter.post('/login', login);
HospitalRouter.post('/register', register);
HospitalRouter.post('/emergencyActivate', HospitalMiddleware, emergencyActivate);

export { HospitalRouter };

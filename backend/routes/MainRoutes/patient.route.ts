import { Router } from 'express';
import {
  loginP,
  registerP,
  getProfile,
  getReportAll,
  getReportOne,
  updateProfile,
  verifyPatient,
} from '../../controllers/index';
import { PatientMiddleware } from '../../middleware/patient.middleware';

const PatientRouter = Router();

PatientRouter.put('/profile', PatientMiddleware, updateProfile);

PatientRouter.post('/login', loginP);
PatientRouter.post('/register', registerP);

PatientRouter.get('/profile', PatientMiddleware, getProfile);
PatientRouter.get('/report', PatientMiddleware, getReportAll);
PatientRouter.get('/report/:id', PatientMiddleware, getReportOne);
PatientRouter.get('/verifyPatient', PatientMiddleware, verifyPatient);

export { PatientRouter };

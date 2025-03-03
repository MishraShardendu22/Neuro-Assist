import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import { postReport, updateReport, deleteReport, getReportsOne } from '../../controllers/index';

const ReportsRouter = Router();

ReportsRouter.post('/postReport', HospitalMiddleware, postReport);

ReportsRouter.put('/updateReport', HospitalMiddleware, updateReport);

ReportsRouter.post('/getReportsOne', HospitalMiddleware, getReportsOne);

ReportsRouter.delete('/deleteReport', HospitalMiddleware, deleteReport);

export { ReportsRouter };

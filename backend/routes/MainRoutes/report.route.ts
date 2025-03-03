import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import { postReport, updateReport, deleteReport, getReportsOne } from '../../controllers/index';

const ReportsRouter = Router();

ReportsRouter.post('/postReport', HospitalMiddleware, postReport);

ReportsRouter.put('/updateReport/:id', HospitalMiddleware, updateReport);

ReportsRouter.get('/getReportsOne/:id', HospitalMiddleware, getReportsOne);

ReportsRouter.delete('/deleteReport/:id', HospitalMiddleware, deleteReport);

export { ReportsRouter };

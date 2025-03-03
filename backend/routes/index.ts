import { Router } from 'express';
import { CasesRouter } from './MainRoutes/case.route';
import { ReportsRouter } from './MainRoutes/report.route';
import { PatientRouter } from './MainRoutes/patient.route';
import { HospitalRouter } from './MainRoutes/hospital.route';
import { DocumentsRouter } from './MainRoutes/document.route';
import { NotificationRouter } from './MainRoutes/notification.route';

const AllRouter = Router();

AllRouter.use('/cases', CasesRouter);
AllRouter.use('/patient', PatientRouter);
AllRouter.use('/reports', ReportsRouter);
AllRouter.use('/hospital', HospitalRouter);
AllRouter.use('/documents', DocumentsRouter);
AllRouter.use('/notification', NotificationRouter);

export { AllRouter };

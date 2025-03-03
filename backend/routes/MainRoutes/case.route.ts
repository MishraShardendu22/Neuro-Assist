import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import {
  postCase,
  deleteCase,
  updateCase,
  getAllCases,
  getUniqueCase,
} from '../../controllers/index';

const CasesRouter = Router();

CasesRouter.post('/postCase', HospitalMiddleware, postCase);

CasesRouter.put('/updateCase/:id', HospitalMiddleware, updateCase);

CasesRouter.delete('/deleteCase/:id', HospitalMiddleware, deleteCase);

CasesRouter.get('/getAllCases', HospitalMiddleware, getAllCases);
CasesRouter.get('/getUniqueCase/:id', HospitalMiddleware, getUniqueCase);

export { CasesRouter };

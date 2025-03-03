import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';import {
  postDocument,
  getDocumentOne,
  updateDocument,
  deleteDocument,
} from '../../controllers/index';

const DocumentsRouter = Router();

DocumentsRouter.post('/postDocument', HospitalMiddleware, postDocument);

DocumentsRouter.put('/updateDocument', HospitalMiddleware, updateDocument);

DocumentsRouter.post('/getDocumentOne', HospitalMiddleware, getDocumentOne);

DocumentsRouter.delete('/deleteDocument', HospitalMiddleware, deleteDocument);

export { DocumentsRouter };

import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import {
  postDocument,
  getDocumentOne,
  updateDocument,
  deleteDocument,
} from '../../controllers/index';

const DocumentsRouter = Router();

DocumentsRouter.post('/postDocument', HospitalMiddleware, postDocument);

DocumentsRouter.put('/updateDocument/:id', HospitalMiddleware, updateDocument);

DocumentsRouter.get('/getDocumentOne/:id', HospitalMiddleware, getDocumentOne);

DocumentsRouter.delete('/deleteDocument/:id', HospitalMiddleware, deleteDocument);

export { DocumentsRouter };

import { Router } from 'express';
import { HospitalMiddleware } from '../../middleware/hospital.middleware';
import { postDocument, getDocumentOne, updateDocument, deleteDocument } from '../../controllers/index'

const DocumentsRouter = Router();

DocumentsRouter.post('/postDocument', HospitalMiddleware, postDocument);

DocumentsRouter.get('/getDocumentOne/:id', HospitalMiddleware, getDocumentOne);

DocumentsRouter.put('/updateDocument/:id', HospitalMiddleware, updateDocument);

DocumentsRouter.delete('/deleteDocument/:id', HospitalMiddleware, deleteDocument);

export { DocumentsRouter };

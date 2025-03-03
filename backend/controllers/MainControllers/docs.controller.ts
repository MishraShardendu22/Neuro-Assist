import { Request, Response } from 'express';
import { apiResponse } from '../../util/apiReponse';
import { Document as Doc, Hospital, Report } from '../../model';

const getDocumentOne = async (req: Request, res: Response) => {
  try {
    const { patientId, caseId } = req.body;
    const document = await Doc.findOne({ caseId, patientId });
    if (!document) {
      return apiResponse(res, 400, 'Document does not exist');
    }

    return apiResponse(res, 200, 'Document Retrieved Successfully', document);
  } catch (err) {
    console.error('Error retrieving document:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const postDocument = async (req: Request, res: Response) => {
  try {
    const { patientId, caseId, documentName, documentType, documentUrl } = req.body;

    if (!patientId || !caseId || !documentName || !documentType || !documentUrl) {
      return apiResponse(res, 400, 'All fields are required');
    }

    const documentExist = await Doc.findOne({ caseId, patientId });
    if (documentExist) {
      return apiResponse(res, 400, 'Document already exists');
    }

    const newDocument = await Doc.create({
      caseId,
      patientId,
      documentName,
      documentType,
      documentUrl,
    });

    return apiResponse(res, 201, 'Document Created Successfully', newDocument);
  } catch (err) {
    console.error('Error creating document:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const updateDocument = async (req: Request, res: Response) => {
  try {
    const { patientId, caseId, documentName, documentType, documentUrl } = req.body;

    if (!patientId || !caseId || !documentName || !documentType || !documentUrl) {
      return apiResponse(res, 400, 'All fields are required');
    }

    const documentExist = await Doc.findOne({ caseId, patientId });
    if (!documentExist) {
      return apiResponse(res, 400, 'Document does not exist');
    }

    documentExist.documentName = documentName;
    documentExist.documentType = documentType;
    documentExist.documentUrl = documentUrl;
    await documentExist.save();

    return apiResponse(res, 200, 'Document Updated Successfully', documentExist);
  } catch (err) {
    console.error('Error updating document:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { patientId, caseId } = req.body;
    const deletedDocument = await Doc.findOneAndDelete({ caseId, patientId });
    if (!deletedDocument) {
      return apiResponse(res, 400, 'Document does not exist');
    }
    return apiResponse(res, 200, 'Document Deleted Successfully');
  } catch (err) {
    console.error('Error deleting document:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

export { getDocumentOne, postDocument, updateDocument, deleteDocument };

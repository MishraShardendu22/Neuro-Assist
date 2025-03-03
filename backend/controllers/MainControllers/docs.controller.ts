import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { apiResponse } from '../../util/apiReponse';
import { Document as Doc, Hospital, Report } from '../../model';

const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber, address } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !address) {
      return apiResponse(res, 400, 'All fields are required');
    }

    if (password.length < 8) {
      return apiResponse(res, 400, 'Password must be at least 8 characters long');
    }

    const hospitalExist = await Hospital.findOne({ email });
    if (hospitalExist) {
      return apiResponse(res, 409, 'Hospital already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newHospital = await Hospital.create({
      email,
      address,
      fullName,
      phoneNumber,
      password: hashedPassword,
    });

    return apiResponse(res, 201, 'Hospital Registered Successfully', newHospital);
  } catch (err) {
    console.error('Error registering hospital:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, 400, 'All fields are required');
    }

    const hospitalExist = await Hospital.findOne({ email });
    if (!hospitalExist) {
      return apiResponse(res, 404, 'Hospital does not exist');
    }

    const isMatch = await bcrypt.compare(password, hospitalExist.password);
    if (!isMatch) {
      return apiResponse(res, 401, 'Invalid Credentials');
    }

    const token = jwt.sign(
      {
        id: hospitalExist._id,
        role: hospitalExist.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    const responseHospital = hospitalExist.toObject();
    responseHospital.password = "Hidden";

    return apiResponse(res, 200, 'Hospital Logged In Successfully', { hospital: responseHospital, token });
  } catch (err) {
    console.error('Error logging in:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

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

export { register, login, getDocumentOne, postDocument, updateDocument, deleteDocument };

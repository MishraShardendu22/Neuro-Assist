import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Hospital, Report } from '../../model';
import { apiResponse } from '../../util/apiReponse';

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

const verifyHospital = async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.body;

    const hospitalExist = await Hospital.findById(hospitalId);
    if (!hospitalExist) {
      return apiResponse(res, 404, 'Hospital does not exist');
    }

    const responseHospital = hospitalExist.toObject();
    responseHospital.password = "Hidden";

    return apiResponse(res, 200, 'Hospital Verified Successfully', responseHospital);
  } catch (err) {
    console.error('Error verifying hospital:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const emergencyActivate = async (req: Request, res: Response) => {
  try {
    const {
      caseId,
      patientId,
      BP = 'N/A',
      HR = 'N/A',
      symptoms = ['N/A'],
      documentId = 'N/A',
      O2_Saturation = 'N/A',
      timeOfLastNormal = new Date(),
    } = req.body;

    if (!caseId || !patientId) {
      return apiResponse(res, 400, 'Case ID and Patient ID are required');
    }

    const reportExist = await Report.findOne({ caseId, patientId });
    if (reportExist) {
      return apiResponse(res, 409, 'Report already exists');
    }

    const newReport = await Report.create({
      BP,
      HR,
      caseId,
      symptoms,
      patientId,
      documentId,
      O2_Saturation,
      timeOfLastNormal,
    });

    return apiResponse(res, 201, 'Report Created Successfully', newReport);
  } catch (err) {
    console.error('Error in emergency activation:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

export { login, register, verifyHospital, emergencyActivate };

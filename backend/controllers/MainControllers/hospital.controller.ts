import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Hospital, Report } from '../../model';
import { apiResponse } from '../../util/apiReponse';

const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber, address } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !address) {
      return apiResponse(res, 400, 'Please fill all fields');
    }

    const hospitalExist = await Hospital.findOne({ email });
    if (hospitalExist) {
      return apiResponse(res, 400, 'Hospital already exists');
    }

    if (password.length < 8) {
      return apiResponse(res, 400, 'Password should be at least 8 characters long');
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return apiResponse(res, 400, 'Please enter a valid 10-digit phone number');
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(5));
    const newHospital = new Hospital({
      email,
      address,
      fullName,
      phoneNumber,
      password: hashedPassword,
    });

    await newHospital.save();
    newHospital.password = 'Hidden for Security Reasons';

    return apiResponse(res, 201, 'Hospital Registered Successfully', newHospital);
  } catch (err) {
    console.error('Error registering hospital:', err);
    if (!res.headersSent) {
      return apiResponse(res, 500, 'Internal Server Error');
    }
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, 400, 'Please fill all fields');
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return apiResponse(res, 404, 'Hospital not found');
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return apiResponse(res, 400, 'Invalid Credentials');
    }

    const token = jwt.sign(
      {
        id: hospital._id,
        role: hospital.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    hospital.password = 'Hidden for Security Reasons';
    return apiResponse(res, 200, 'Hospital Logged In Successfully', hospital, token);
  } catch (err) {
    console.error('Error logging in hospital:', err);
    if (!res.headersSent) {
      return apiResponse(res, 500, 'Internal Server Error');
    }
  }
};

const verifyHospital = async (req: Request, res: Response) => {
  try {
    console.log('CP-H-1');
    const { hospitalId } = req.body;

    console.log('CP-H-2');
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return apiResponse(res, 404, 'Hospital not found');
    }

    console.log('CP-H-3');
    return apiResponse(res, 200, 'Hospital Verified Successfully', hospital);
  } catch (err) {
    console.log('Error verifying hospital:', err);
    if (!res.headersSent) {
      return apiResponse(res, 500, 'Internal Server Error');
    }
  }
};

const emergencyActivate = async (req: Request, res: Response) => {
  try {
    console.log("CP-1")
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

    console.log("CP-2")
    if (!caseId || !patientId) {
      return apiResponse(res, 400, 'Case ID and Patient ID are required');
    }

    console.log("CP-3")
    const reportExist = await Report.findOne({ caseId, patientId });
    if (reportExist) {
      return apiResponse(res, 409, 'Report already exists');
    }

    console.log("CP-4")
    const newReport = new Report({
      caseId,
      patientId,
      BP,
      HR,
      symptoms,
      documentId,
      O2_Saturation,
      timeOfLastNormal,
    });

    console.log("CP-5")
    await newReport.save();

    console.log("CP-6")
    return apiResponse(res, 201, 'Report Created Successfully', newReport);
  } catch (err) {
    console.error('Error in emergency activation:', err);
    if (!res.headersSent) {
      return apiResponse(res, 500, 'Internal Server Error');
    }
  }
};

export { login, register, verifyHospital, emergencyActivate };
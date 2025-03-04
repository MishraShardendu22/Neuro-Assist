import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Patient, Report } from '../../model';
import { apiResponse } from '../../util/apiReponse';

const registerP = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber, gender } = req.body;
    console.log('CP-1');

    if (!fullName || !email || !password || !phoneNumber || !gender) {
      console.log('CP-2.5');
      return apiResponse(res, 400, 'Please fill all fields');
    }

    let patientId;
    do {
      patientId =
        'P-' + fullName.split(' ').join('').toLowerCase() + '-' + Math.floor(Math.random() * 1000);
    } while (await Patient.findOne({ patientId }));

    console.log('CP-2');
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return apiResponse(res, 400, 'Patient already exists');
    }

    console.log('CP-4');
    if (password.length < 8) {
      return apiResponse(res, 400, 'Password should be at least 8 characters long');
    }

    console.log('CP-5');
    if (!/^\d{10}$/.test(phoneNumber)) {
      return apiResponse(res, 400, 'Please enter a valid 10-digit phone number');
    }

    console.log('CP-6');
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(5));

    console.log('CP-7');
    const newPatient = new Patient({
      email,
      gender,
      fullName,
      patientId,
      phoneNumber,
      password: hashedPassword,
    });

    console.log('CP-8');
    await newPatient.save();
    newPatient.password = 'Hidden for Security Reasons';

    console.log('CP-9');
    return apiResponse(res, 201, 'Patient Registered Successfully', newPatient);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const loginP = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, 400, 'Please fill all fields');
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return apiResponse(res, 404, 'Patient not found');
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return apiResponse(res, 400, 'Invalid Credentials');
    }

    const token = jwt.sign(
      {
        id: patient._id,
        role: patient.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    patient.password = 'Hidden for Security Reasons';
    return apiResponse(res, 200, 'Patient Logged In Successfully', patient, token);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const verifyPatient = async (req: Request, res: Response) => {
  try {
    console.log('CP-1');
    const { patientId, role } = req.body;
    // console.log(patientId);
    // console.log(role);

    console.log('CP-2');
    if (!role || role !== 'Patient') {
      return apiResponse(res, 401, 'Unauthorized Access');
    }

    console.log('CP-3');
    if (!patientId || typeof patientId !== 'string') {
      return apiResponse(res, 400, 'Invalid Patient ID');
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return apiResponse(res, 404, 'Patient not found');
    }

    console.log('CP-4');
    return apiResponse(res, 200, 'Patient Verified Successfully', patient);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const getReportAll = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.body;
    const reports = await Report.find({ patientId: patientId });

    return apiResponse(res, 200, 'Reports Found Successfully', reports);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const getReportOne = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.body;
    const reportId = req.params.id;
    const report = await Report.findOne({ patientId: patientId, reportId });

    if (!report) {
      return apiResponse(res, 404, 'Report not found');
    }

    return apiResponse(res, 200, 'Report Found Successfully', report);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return apiResponse(res, 404, 'Patient not found');
    }

    return apiResponse(res, 200, 'Patient Found Successfully', patient);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { patientId, fullName, email, phoneNumber } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return apiResponse(res, 404, 'Patient not found');
    }

    patient.phoneNumber = phoneNumber || patient.phoneNumber;
    patient.fullName = fullName || patient.fullName;
    patient.email = email || patient.email;

    await patient.save();
    return apiResponse(res, 200, 'Patient Updated Successfully', patient);
  } catch (err) {
    console.error('There was an Error', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

export { loginP, registerP, getProfile, getReportOne, getReportAll, updateProfile, verifyPatient };

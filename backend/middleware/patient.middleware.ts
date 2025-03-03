import jwt from 'jsonwebtoken';
import { apiResponse } from '../util/apiReponse';
import { NextFunction, Request, Response } from 'express';

export const PatientMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("CP-M-0");
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return apiResponse(res, 401, 'Unauthorized');
    }
    console.log("Token: ", token);
    console.log("CP-M-1");

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        apiResponse(res, 401, 'Unauthorized');
      }
      console.log("CP-M-2");

      if (!decoded) {
        return apiResponse(res, 401, 'Unauthorized');
      }
      console.log("CP-M-3");

      const decodedToken = decoded as { id: string; role: string };
      req.body.patientId = decodedToken.id;
      req.body.role = decodedToken.role;

      console.log("CP-M-4");
      if ((decoded as { role: string }).role !== 'Patient') {
        apiResponse(res, 401, 'Unauthorized');
      }

      console.log("CP-M-5");
      if (req.body.patientId === undefined || req.body.role === undefined) {
        apiResponse(res, 403, 'Forbidden');
      }
    });
    console.log("CP-M-6");
    next();
  } catch (error) {
    console.log('There was an Error', error);
    apiResponse(res, 500, 'Internal Server Error');
  }
};

import { NextFunction, Request, Response } from 'express';
import { apiResponse } from '../util/apiReponse';
import jwt from 'jsonwebtoken';

export const HospitalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log('CP-H-M-0');
    if (!token) {
      return apiResponse(res, 401, 'Unauthorized');
    }

    console.log('CP-H-M-1');
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        apiResponse(res, 401, 'Unauthorized');
      }

      if (!decoded) {
        return apiResponse(res, 401, 'Unauthorized');
      }

      console.log('CP-H-M-2');
      const decodedToken = decoded as { id: string; role: string };
      req.body.hospitalId = decodedToken.id;
      req.body.role = decodedToken.role;

      console.log('CP-H-M-3');
      if ((decoded as { role: string }).role !== 'Hospital') {
        apiResponse(res, 401, 'Unauthorized');
      }

      console.log('CP-H-M-4');
      if (req.body.hospitalId === undefined || req.body.role === undefined) {
        apiResponse(res, 403, 'Forbidden');
      }
    });
    
    console.log('CP-H-M-5');
    next();
  } catch (error) {
    console.log('There was an Error', error);
    apiResponse(res, 500, 'Internal Server Error');
  }
};

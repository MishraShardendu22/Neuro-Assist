import { NextFunction, Request, Response } from 'express';
import { apiResponse } from '../util/apiReponse';
import jwt from 'jsonwebtoken';

export const HospitalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return apiResponse(res, 401, 'Unauthorized');
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        apiResponse(res, 401, 'Unauthorized');
      }

      if (!decoded) {
        return apiResponse(res, 401, 'Unauthorized');
      }

      const decodedToken = decoded as { id: string; role: string };
      req.body.hospitalId = decodedToken.id;
      req.body.role = decodedToken.role;

      if ((decoded as { role: string }).role !== 'Hospital') {
        apiResponse(res, 401, 'Unauthorized');
      }

      if (req.body.hospitalId === undefined || req.body.role === undefined) {
        apiResponse(res, 403, 'Forbidden');
      }
    });
    next();
  } catch (error) {
    console.log('There was an Error', error);
    apiResponse(res, 500, 'Internal Server Error');
  }
};

import { Response } from 'express';

export const apiResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data: T = {} as T,
  token?: string
) => {
  res.status(status).json({
    Message: message,
    Data: data,
    Token: token ?? '',
  });
};

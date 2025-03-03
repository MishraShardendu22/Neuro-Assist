import { Error } from 'mongoose';
import { Notification } from '../../model';
import { Request, Response } from 'express';
import { apiResponse } from '../../util/apiReponse';

const getAllNotification = async (req: Request, res: Response) => {
  try {
    const hospitalId = req.body._id;
    const notifications = await Notification.find({ hospitalId });

    return apiResponse(res, 200, 'Success', notifications);
  } catch (error) {
    return apiResponse(res, 500, (error as Error).message);
  }
};

const postNotification = async (req: Request, res: Response) => {
  try {
    const hospitalId = req.body._id;
    const { notification } = req.body;

    if (!notification) {
      return apiResponse(res, 400, 'Notification content is required');
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { hospitalId },
      { $push: { notifications: notification } },
      { new: true, upsert: true }
    );

    return apiResponse(res, 200, 'Success', [updatedNotification]);
  } catch (error) {
    return apiResponse(res, 500, (error as Error).message);
  }
};


export { 
  postNotification,
  getAllNotification,
};

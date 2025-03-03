import { Error } from 'mongoose';
import { Notification } from '../../model';
import { Request, Response } from 'express';
import { apiResponse } from '../../util/apiReponse';

const getAllNotification = async (req: Request, res: Response) => {
  try {
    const hospitalId = req.body.hospitalId;
    const notifications = await Notification.findOne({ hospitalId });

    if (!notifications || !notifications.notifications.length) {
      return apiResponse(res, 404, 'No Notifications Found', null);
    }

    return apiResponse(res, 200, 'Success', notifications);
  } catch (error) {
    return apiResponse(res, 500, (error as Error).message);
  }
};

const postNotification = async (req: Request, res: Response) => {
  try {
    const hospitalId = req.body.hospitalId;
    const { notification } = req.body;

    if (!notification) {
      return apiResponse(res, 400, 'Notification content is required');
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { hospitalId },
      { $push: { notifications: notification } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return apiResponse(res, 200, 'Notification Added Successfully', updatedNotification);
  } catch (error) {
    return apiResponse(res, 500, (error as Error).message);
  }
};

export { postNotification, getAllNotification };

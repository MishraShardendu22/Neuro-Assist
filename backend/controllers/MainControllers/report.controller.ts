import { Report } from '../../model';
import { Request, Response } from 'express';
import { apiResponse } from '../../util/apiReponse';

const postReport = async (req: Request, res: Response) => {
  try {
    const { caseId, patientId, documentId, timeOfLastNormal, symptoms, BP, HR, O2_Saturation } = req.body;

    if (!caseId || !patientId || !documentId || !timeOfLastNormal || !symptoms || !BP || !HR || !O2_Saturation) {
      return apiResponse(res, 400, 'All fields are required');
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
    console.error('Error creating report:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const getReportsOne = async (req: Request, res: Response) => {
  try {
    const { caseId, patientId } = req.body;

    const report = await Report.findOne({ caseId, patientId });
    if (!report) {
      return apiResponse(res, 404, 'Report does not exist', null);
    }

    return apiResponse(res, 200, 'Report Retrieved Successfully', report);
  } catch (err) {
    console.error('Error retrieving report:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const updateReport = async (req: Request, res: Response) => {
  try {
    const { caseId, patientId, documentId, timeOfLastNormal, symptoms, BP, HR, O2_Saturation } =
      req.body;

    if (!caseId || !patientId || !documentId || !timeOfLastNormal || !symptoms || !BP || !HR || !O2_Saturation) {
      return apiResponse(res, 400, 'All fields are required');
    }

    const updatedReport = await Report.findOneAndUpdate(
      { caseId, patientId },
      { BP, HR, symptoms, timeOfLastNormal, O2_Saturation },
      { new: true }
    );

    if (!updatedReport) {
      return apiResponse(res, 404, 'Report does not exist', null);
    }

    return apiResponse(res, 200, 'Report Updated Successfully', updatedReport);
  } catch (err) {
    console.error('Error updating report:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

const deleteReport = async (req: Request, res: Response) => {
  try {
    const { caseId, patientId } = req.body;

    const report = await Report.findOne({ caseId, patientId });
    if (!report) {
      return apiResponse(res, 404, 'Report does not exist', null);
    }

    await Report.findOneAndDelete({ caseId, patientId });

    return apiResponse(res, 200, 'Report Deleted Successfully');
  } catch (err) {
    console.error('Error deleting report:', err);
    return apiResponse(res, 500, 'Internal Server Error');
  }
};

export { postReport, updateReport, deleteReport, getReportsOne };
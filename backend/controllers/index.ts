import {
  postDocument,
  getDocumentOne,
  updateDocument,
  deleteDocument,
} from './MainControllers/docs.controller';

import {
  postCase,
  deleteCase,
  updateCase,
  getAllCases,
  getUniqueCase,
} from './MainControllers/cases.controller';

import {
  postReport,
  updateReport,
  deleteReport,
  getReportsOne,
} from './MainControllers/report.controller';

import {
  loginP,
  registerP,
  getProfile,
  verifyPatient,
  getReportAll,
  getReportOne,
  updateProfile,
} from './MainControllers/patient.controller';

import { 
  postNotification, 
  getAllNotification 
} from './MainControllers/notification.controller';


import {
  login,
  register,
  verifyHospital,
  emergencyActivate,
} from '../controllers/MainControllers/hospital.controller';

export {
  login,
  loginP,
  register,
  postCase,
  registerP,
  getProfile,
  deleteCase,
  updateCase,
  postReport,
  getAllCases,
  updateReport,
  deleteReport,
  postDocument,
  getReportAll,
  getReportOne,
  updateProfile,
  verifyPatient,
  getUniqueCase,
  getReportsOne,
  verifyHospital,
  getDocumentOne,
  updateDocument,
  deleteDocument,
  postNotification,
  emergencyActivate,
  getAllNotification,
};
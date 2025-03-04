import { Document, Types } from 'mongoose';

export interface IPatient extends Document {
  email: string;
  role: 'Patient';
  password: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
  patientId: string;
  phoneNumber: Number;
  gender: 'Male' | 'Female';
}

export interface IHospital extends Document {
  email: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: 'Hospital';
  password: string;
  fullName: string;
  hospitalId: string;
  phoneNumber: Number;
  cases: Types.ObjectId[];
}

export interface ICase extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  patientId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface IDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  documentUrl: string;
  documentName: string;
  caseId: Types.ObjectId;
  patientId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  documentType:
    | 'pdf'
    | 'doc'
    | 'csv'
    | 'ppt'
    | 'txt'
    | 'xls'
    | 'pptx'
    | 'docx'
    | 'xlsx'
    | 'png'
    | 'jpeg'
    | 'jpg'
    | 'mp4'
    | 'avi'
    | 'mov'
    | 'mkv'
    | 'image'
    | 'video';
}

export interface IReport extends Document {
  BP?: string;
  HR?: string;
  createdAt?: Date;
  updatedAt?: Date;
  symptoms: string[];
  O2_Saturation?: string;
  timeOfLastNormal: Date;
  caseId: Types.ObjectId;
  patientId: Types.ObjectId;
  documentId?: Types.ObjectId;
}

export interface INotification extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  notifications: string[];
  hospitalId: Types.ObjectId;
}

/*
  So basically there are two types of documents 
  Images and Reports
  Reports can be docs or Pdf and will be made By Doctor/Hospital himself,reports are filan verdict of the doctor.
  Images will be uploaded by Hospital on behalf of Patient,Images can have annotations, Images are completely optional.
*/
/*
  Should Case Contain report Id? That’s a solid observation. It really comes down to your app’s query patterns. Keeping documents and reports in their own collections and referencing the case with a caseId is a classic normalized approach, making them independent and easier to manage. However, if you’re often fetching a case along with its related documents and reports, embedding their IDs directly in the case document as arrays can speed up lookups. It's all about weighing the trade-offs between normalization (flexibility and smaller document sizes) and denormalization (query performance and convenience).
*/

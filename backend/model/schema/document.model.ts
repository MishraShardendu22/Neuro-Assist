import { Schema } from 'mongoose';
import { IDocument } from '../Type/data.type';

export const documentSchema: Schema<IDocument> = new Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: [true, 'Case ID is required'],
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Patient ID is required'],
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    documentName: {
      type: String,
      required: [true, 'Document Name is required'],
    },
    documentType: {
      type: String,
      enum: [
        'pdf',
        'doc',
        'csv',
        'ppt',
        'txt',
        'xls',
        'pptx',
        'docx',
        'xlsx',
        'png',
        'jpeg',
        'jpg',
        'mp4',
        'avi',
        'mov',
        'mkv',
        'image',
        'video',
      ],
      required: [true, 'Document Type is required'],
    },
    documentUrl: {
      type: String,
      required: [true, 'Document URL is required'],
    },
  },
  { timestamps: true }
);

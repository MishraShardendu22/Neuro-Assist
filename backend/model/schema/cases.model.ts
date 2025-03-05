import { Schema } from 'mongoose';
import { ICase } from '../Type/data.type';

export const caseSchema: Schema<ICase> = new Schema(
  {
    caseName: {
      type: String,
      required: [true, 'Case Name is required'],
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital ID is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

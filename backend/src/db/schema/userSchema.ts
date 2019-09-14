import { Document, model, Schema } from 'mongoose';
import { Employee, Employer } from '../../../../interfaces/users';
import { encryptPassword } from '../../util/auth';

const { String, Number, Boolean, Date, ObjectId, Mixed } = Schema.Types;

export const EmployerRecordSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

EmployerRecordSchema.pre('save', encryptPassword);

// Mongoose Document Object
export type EmployerRecordModel = Employer & Document;

// Create Mongoose Model
export const EmployerRecord = model<EmployerRecordModel>(
  'EmployerRecord',
  EmployerRecordSchema
);

export const EmployeeRecordSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  annotations: [
    {
      type: ObjectId,
      ref: 'AnnotationRecord',
    },
  ],
});

EmployeeRecordSchema.pre('save', encryptPassword);

// Mongoose Document Object
export type EmployeeRecordModel = Employee & Document;

// Create Mongoose Model
export const EmployeeRecord = model<EmployeeRecordModel>(
  'EmployeeRecord',
  EmployeeRecordSchema
);

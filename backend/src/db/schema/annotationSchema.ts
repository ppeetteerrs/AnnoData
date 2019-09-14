import { Document, model, Schema } from 'mongoose';
import { AnnotationMaster } from '../../../../interfaces/tasks/taskMaster';

const { String, Number, Boolean, Date, ObjectId, Mixed } = Schema.Types;

export const AnnotationRecordSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'EmployeeRecord',
  },
  option: String,
  valid: Boolean,
  taskID: {
    type: ObjectId,
    ref: 'TaskRecord',
  },
  status: String,
});

// Mongoose Document Object
export type AnnotationRecordModel = AnnotationMaster & Document;
// Create Mongoose Model

export const AnnotationRecord = model<AnnotationRecordModel>(
  'AnnotationRecord',
  AnnotationRecordSchema
);

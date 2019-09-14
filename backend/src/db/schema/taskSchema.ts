import { Document, model, Schema } from 'mongoose';
import { TaskMaster } from '../../../../interfaces/tasks/taskMaster';

const { String, Number, Boolean, Date, ObjectId, Mixed } = Schema.Types;

export const TaskRecordSchema = new Schema({
  meta: {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    employerId: {
      type: ObjectId,
      ref: 'EmployerRecord',
    },
    employerName: {
      type: String,
      index: true,
    },
  },
  info: Mixed,
  rawData: [String],
  annotations: [
    {
      type: ObjectId,
      ref: 'AnnotationRecord',
    },
  ],
});

// Mongoose Document Object
export type TaskRecordModel = TaskMaster & Document;

// Create Mongoose Model
export const TaskRecord = model<TaskRecordModel>(
  'TaskRecord',
  TaskRecordSchema
);

export const FileRecordSchema = new Schema({
  metadata: {
    filename: String,
    mime: String,
    originalName: String,
    employer: String,
    zipFolderName: String,
  },
});

// Mongoose Document Object
export type FileRecordModel = Document;

// Create Mongoose Model
export const FileRecord = model<FileRecordModel>(
  'FileRecord',
  FileRecordSchema,
  'bucket.files'
);

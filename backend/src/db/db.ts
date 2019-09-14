import bb from 'bluebird';
import { createReadStream } from 'fs';
import moment, { Moment } from 'moment';
import { GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import mg, { Document, DocumentQuery, Query } from 'mongoose';
import multer from 'multer';
import uuid from 'uuid/v4';
import { CRED, DB_HOST, DB_NAME } from '../config';
import { Timer } from '../util/timer';
import {
  AnnotationRecord,
  AnnotationRecordModel,
} from './schema/annotationSchema';
import { FileRecord, TaskRecord, TaskRecordModel } from './schema/taskSchema';
import {
  EmployeeRecord,
  EmployeeRecordModel,
  EmployerRecord,
  EmployerRecordModel,
} from './schema/userSchema';

class DBConnection {
  ready: Promise<void>;
  host: string = DB_HOST;
  port: number = 27017;
  dbName: string = DB_NAME;
  connection: mg.Connection = mg.connection;
  taskRecords: mg.Model<TaskRecordModel> = TaskRecord;
  annotationRecords: mg.Model<AnnotationRecordModel> = AnnotationRecord;
  employeeRecords: mg.Model<EmployeeRecordModel> = EmployeeRecord;
  employerRecords: mg.Model<EmployerRecordModel> = EmployerRecord;
  fileRecords: mg.Model<Document> = FileRecord;
  gfs: GridFSBucket | undefined;

  constructor() {
    this.ready = this.setup().catch(err => {
      console.error('DB Setup Error');
      process.exit(1);
    });
  }

  // Setup Database
  async setup() {
    await mg.connect(`mongodb://${this.host}:${this.port}/${this.dbName}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    this.gfs = new GridFSBucket(this.connection.db, {
      bucketName: 'bucket',
    });
  }

  // // Fetch all user data within a range, data will not be populated if no range is passed to avoid crashing
  // async uploadFile(
  //   fileStream: NodeJS.ReadableStream,
  //   filename: string,
  //   encoding: string,
  //   mime: string
  // ) {
  //   if (this.connected && this.gfs) {
  //     const uploadStream = this.gfs.openUploadStream(filename, {
  //       contentType: mime,
  //       metadata: {
  //         encoding,
  //       },
  //     });
  //     fileStream.pipe(uploadStream);
  //   } else {
  //     await this.connect();
  //   }
  // }

  // async downloadFile(
  //   filename: string
  // ): Promise<GridFSBucketReadStream | undefined> {
  //   if (this.connected && this.gfs) {
  //     return this.gfs.openDownloadStreamByName(filename);
  //   } else {
  //     await this.connect();
  //   }
  // }
}

export const DB = new DBConnection();

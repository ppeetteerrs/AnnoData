import { ObjectId } from 'bson';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { lookup } from 'mime-types';
import { GridFSBucket, GridFSBucketWriteStream } from 'mongodb';
import { Document } from 'mongoose';
import Busboy from 'multer';
import { StorageEngine } from 'multer';
import { pipeline, Transform } from 'stream';
import unzipper, { Entry, Parse, ParseStream } from 'unzipper';
import { promisify } from 'util';
import { TaskMaster } from '../../../interfaces/tasks/taskMaster';
import { DB } from '../db/db';
import { TaskRecord, TaskRecordModel } from '../db/schema/taskSchema';
import { EmployerRecordModel } from '../db/schema/userSchema';
import { AuthInfo } from './auth';

export async function createTask(req: Request) {
  const {
    taskInfo,
    user,
    auth,
  }: {
    taskInfo: TaskMaster;
    user: EmployerRecordModel;
    auth: AuthInfo;
  } = req.body;
  if (user) {
    const task = new TaskRecord({
      ...taskInfo,
      meta: {
        ...taskInfo.meta,
        employerId: user._id,
        employerName: user.username,
      },
    });
    const savedTask = await task.save();
    return savedTask;
  } else {
    return null;
  }
}

export async function removeTask(req: Request) {
  const taskID: string = req.body.taskID;
  if (taskID) {
    const task = await TaskRecord.findById(taskID).exec();
    if (task) {
      task.remove();
    }
    return task;
  } else {
    return null;
  }
}

export async function findTasks(username: string) {
  const tasks = await TaskRecord.find({
    'meta.employerName': username,
  });
  return tasks;
}

export async function uploadCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const taskId: string = req.body.taskId;
  if (!taskId) {
    res.status(200).send('Unauthorized: No task ID provided');
  } else {
    const task = await TaskRecord.findById(taskId)
      .exec()
      .catch(err => {
        res.status(200).json('Unable to find task');
      });
    if (
      task &&
      task.meta.employerName == (req as SecuredRequest).auth.userName
    ) {
      (req as any).task = task;
      next();
    } else {
      res.status(401).json('Not your task');
    }
  }
}

export const gridFSStorage: StorageEngine = {
  // Handle a file stream
  _handleFile: async (
    req: SecuredRequest & {
      body: {
        taskId: string;
      };
      task: TaskRecordModel;
    },
    file: Express.Multer.File & { stream: NodeJS.ReadableStream },
    cb: (error?: any, info?: any) => void
  ) => {
    const { body } = req as SecuredRequest;

    // Check GridFS Connection and req body
    if (!DB.gfs || !body.taskId) {
      return cb(Error('GridFS not connected'));
    }

    // Wait for DB to get ready
    await DB.ready.catch(cb);

    // Find
    const { filename, mime, valid } = generateFilename(
      file.filename,
      req.auth.userName
    );
    if (valid) {
      const gfsStream = DB.gfs.openUploadStream(filename, {
        contentType: mime,
      });

      await promisify(pipeline)(file.stream, gfsStream).catch(cb);

      if (req.task.rawData) {
        req.task.rawData.push({
          id: gfsStream.id.toString(),
          filename,
        });
      } else {
        req.task.rawData = [
          {
            id: gfsStream.id.toString(),
            filename,
          },
        ];
      }

      await req.task.save().catch(cb);

      cb(null, {});
    } else {
      cb(null, {});
    }
  },
  // Remove the file when upload cancelled
  _removeFile: async (
    req: Request,
    file: Express.Multer.File & {
      stream: NodeJS.ReadableStream;
      fileID: ObjectId;
    },
    cb
  ) => {},
};

function generateFilename(
  filename: string,
  employer: string
): {
  filename: string;
  mime: string | undefined;
  valid: boolean;
} {
  const filenameArr = filename.split('.');
  const fileExtension = filenameArr[filenameArr.length - 1];
  return {
    filename: `${employer}_${Date.now()}.${fileExtension}`,
    mime: lookup(fileExtension) || undefined,
    valid:
      filename.indexOf('.') > 0 &&
      filenameArr.length > 1 &&
      !filename.endsWith('.') &&
      !filename.startsWith('__MACOSX'),
  };
}

async function handleUploadErrors(zipFolderName: string) {
  console.log('Removing');
  if (DB.gfs) {
    const { gfs } = DB;
    const uploadedFiles: Document[] = await DB.gfs
      .find({
        'metadata.zipFolderName': zipFolderName,
      })
      .toArray();
    console.log(uploadedFiles);
    uploadedFiles.forEach(uploadedFile => {
      gfs.delete(uploadedFile._id, () => {
        console.log(`Deleted ${uploadedFile._id}`);
      });
    });
  }
}

// export class ZipUploadManager {
//   employer: string;
//   zipFolderName: string;
//   file: Express.Multer.File & { stream: NodeJS.ReadableStream };
//   gfs: GridFSBucket;
//   newTask: boolean;
//   activeFiles: {
//     filename: string;
//     stream: GridFSBucketWriteStream;
//     id: ObjectId;
//   }[] = [];
//   failureCount: number = 0;
//   successCount: number = 0;

//   constructor(
//     employer: string,
//     file: Express.Multer.File & { stream: NodeJS.ReadableStream },
//     newTask: boolean,
//     gfs: GridFSBucket
//   ) {
//     this.employer = employer;
//     this.zipFolderName = this.generateFilename().filename;
//     this.file = file;
//     this.newTask = newTask;
//     this.gfs = gfs;
//   }

//   run = async () => {
//     // Wait for busboy stream to end
//     return promisify(pipeline)(
//       this.file.stream,
//       unzipper.Parse({}),
//       new Transform({
//         objectMode: true,
//         transform: this.handleZipEntry,
//       })
//     );
//   }

//   generateFilename = (
//     filename: string = 'zipFolder'
//   ): {
//     filename: string;
//     mime: string | undefined;
//     valid: boolean;
//   } => {
//     const filenameArr = filename.split('.');
//     const fileExtension = filenameArr[filenameArr.length - 1];
//     return {
//       filename: `${this.employer}_${Date.now()}.${fileExtension}`,
//       mime: lookup(fileExtension) || undefined,
//       valid:
//         filename.indexOf('.') > 0 &&
//         filenameArr.length > 1 &&
//         !filename.endsWith('.') &&
//         !filename.startsWith('__MACOSX'),
//     };
//   }

//   handleZipEntry = (entry: Entry, encoding: string) => {
//     // Generate filename and mime type
//     const { filename, mime, valid } = this.generateFilename(entry.path);
//     if (valid) {
//       try {
//         this.handleUnzipped(entry, filename, mime);
//       } catch (error) {
//         this.handleFailure(error);
//       }
//     } else {
//       entry.autodrain();
//     }
//   }

//   handleUnzipped = (entry: Entry, filename: string, mime?: string) => {
//     // Extract Entry Info
//     const {
//       path: originalName,
//       extra: { uncompressedSize: size },
//     } = entry;

//     if (originalName.endsWith('1.jpg')) {
//       console.log('Reached');
//       throw Error('trial');
//     }

//     const metadata = {
//       filename,
//       mime,
//       originalName,
//       employer: this.employer,
//       size,
//       zipFolderName: this.zipFolderName,
//     };

//     // Create GridFS Stream
//     const gfsStream = this.gfs.openUploadStream(filename, {
//       contentType: mime,
//       metadata,
//     });

//     // Pipe file to GridFS
//     const uploadStream = entry.pipe(gfsStream);

//     this.activeFiles.push({
//       filename,
//       stream: uploadStream,
//       id: gfsStream.id as ObjectId,
//     });

//     // Handle Upload Errors
//     uploadStream.on('error', err => {
//       console.log(`GridFS File Upload Error: ${err}`);
//       console.log(`Metadata: ${metadata}`);
//       throw err;
//     });
//   }

//   handleFailure = async (err: Error) => {
//     console.log(`Zip Stream Failed with error: ${err}`);

//     for (let activeFile of this.activeFiles) {
//       activeFile.stream.destroy();
//     }

//     this.zipStream.destroy();

//     for (let activeFile of this.activeFiles) {
//       this.gfs.delete(activeFile.id);
//     }

//     // // End Zip Stream
//     // this.activeFiles.forEach(async activeFile => {
//     //   // End all active streams
//     //   activeFile.stream.destroy();
//     //   console.log(activeFile.id);
//     //   this.gfs.delete(activeFile.id, err => {
//     //     console.log(`    File ${activeFile.filename} Successfully Removed`);
//     //     this.failureCount++;
//     //     if (this.failureCount == this.activeFiles.length) {
//     //       console.log(this.activeFiles.length);
//     //       this.zipStream.destroy(err);
//     //     }
//     //   });
//     //   await DB.fileRecords
//     //     .deleteMany({
//     //       _id: activeFile.id,
//     //     })
//     //     .exec();
//     // });
//   }
// }

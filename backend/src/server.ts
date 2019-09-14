import bp from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import moment, { Moment } from 'moment';
import { GridFSBucketReadStream } from 'mongodb';
import multer from 'multer';
import { HOST, PORT } from './config';
import { DB } from './db/db';
import { authRouter } from './routes/auth';
import { tasksRouter } from './routes/tasks';

// Connect DB
const app = express();

// Library middleware
app.use(
  cors({
    origin: '*',
  })
);
app.use(bp.json({}));

// Routing
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

// Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.stringify(err, null, 4));
  res.status(500).json(err);
});

// Start Listening to Port
async function startServer(host: string, port: number) {
  await DB.setup();
  console.log('DB Connected');

  // Port Setting
  app.listen(port, host, () => console.log(`Running on Port ${host}:${port}`));
}

startServer(HOST, PORT);

import express from 'express';
import multer from 'multer';
import { TaskMaster } from '../../../interfaces/tasks/taskMaster';
import { EmployerSecuredRequest } from '../interfaces/auth';
import { fetchUser, findEmployer, secured, SecuredRequest } from '../util/auth';
import {
  createTask,
  findTasks,
  gridFSStorage,
  uploadCheck,
} from '../util/tasks';

const upload = multer({
  storage: gridFSStorage,
});

export const tasksRouter = express.Router({
  caseSensitive: false,
  mergeParams: false,
});

tasksRouter.use('/', secured, fetchUser);

tasksRouter.post('/tasks', async (req, res, next) => {
  const tasks = await findTasks((req as SecuredRequest).auth.userName).catch(
    err => {
      res.status(200).json('Error while finding tasks');
    }
  );
  res.json(tasks);
});

tasksRouter.post('/newTask', async (req, res, next) => {
  const newTask = await createTask(req as EmployerSecuredRequest).catch(err => {
    res.status(200).json('Error while creating tasks');
  });
  res.json(newTask);
});

tasksRouter.post('/remove', async (req, res, next) => {
  const newTask = await createTask(req as EmployerSecuredRequest).catch(err => {
    res.status(200).json('Error while creating tasks');
  });
  res.json(newTask);
});

tasksRouter.post(
  '/uploadFiles',
  uploadCheck,
  upload.any(),
  async (req, res, next) => {
    res.json(req.files);
  }
);

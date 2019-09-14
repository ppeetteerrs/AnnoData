import express from 'express';
import { EmployeeRecord, EmployerRecord } from '../db/schema/userSchema';
import { createUser, generateToken, secured, verifyUser } from '../util/auth';

// Create Router
export const authRouter = express.Router({
  caseSensitive: false,
  mergeParams: false,
});

// Create Employer
authRouter.post('/employer/create', createUser('employer'));

authRouter.post('/employee/create', createUser('employee'));

authRouter.post('/employer/login', verifyUser('employer'));

authRouter.post('/employee/login', verifyUser('employee'));

authRouter.use('/verify', secured, (req, res, next) => {
  console.log(req.body.auth);
  res.status(200).json(req.body.auth);
});

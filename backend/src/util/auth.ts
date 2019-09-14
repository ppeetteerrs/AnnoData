import { compare, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { sign, verify } from 'jsonwebtoken';
import { Document, HookNextFunction } from 'mongoose';
import { EmployeeRecord, EmployerRecord } from '../db/schema/userSchema';

const SECRET = 'annodata-secret-code';
const SALT_ROUNDS = 10;

export type AuthInfo = {
  username: string;
  userType: 'employer' | 'employee';
};

export function secured(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

    if (!token) {
      next(new Error('[Server] Unauthorized: No token provided'));
      return;
    }

    const decodedContent = <AuthInfo>verify(token, SECRET);

    req.body.auth = {
      ...decodedContent,
    };

    console.log(`Verified: ${JSON.stringify(req.body.auth, null, 4)}`);

    next();
  } catch (err) {
    console.log(err);
    next(new Error('[Server] Invalid token'));
  }
}

export async function fetchUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, userType } = req.body.auth;
    const userDB = userType === 'employer' ? EmployerRecord : EmployeeRecord;

    // Find user record
    const user = await userDB
      .findOne({
        username,
      })
      .lean();

    if (!user) {
      next(new Error('[Server] User not found'));
      return;
    }

    req.body.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(new Error('[Server] Error fetching user record.'));
  }
}

export function createUser(userType: 'employer' | 'employee') {
  const userDB = userType === 'employer' ? EmployerRecord : EmployeeRecord;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, displayName, password } = req.body;
      const user = new userDB({
        username,
        password,
        displayName,
      });

      await user.save().catch(err => {
        console.log(err);
        next(new Error(`[Mongoose] Error saving user of type ${userType}`));
      });

      if (user) {
        res.status(200).json(user.toJSON());
      }
    } catch (err) {
      console.log(err);
      next(new Error(`[Server] Error creating user of type ${userType}.`));
    }
  };
}

export function verifyUser(userType: 'employer' | 'employee') {
  const userDB = userType === 'employer' ? EmployerRecord : EmployeeRecord;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      // Find user record
      const user = await userDB
        .findOne({
          username,
        })
        .lean();

      if (!user) {
        next(new Error('[Server] User not found'));
        return;
      }

      const result = await compare(user.password, password).catch(err => {
        console.log(err);
        next(new Error('[JWT] Error verifying password'));
      });

      if (!result) {
        next(new Error('[Server] Incorrect password'));
        return;
      }

      const token = generateToken({
        username,
        userType: 'employer',
      });

      res.status(200).json({
        token,
      });
    } catch (err) {
      console.log(err);
      next(new Error('[Server] Error verifying user credentials.'));
    }
  };
}

export async function encryptPassword(
  this: Document & {
    password: string;
  },
  next: HookNextFunction
) {
  if (this.isNew || this.isModified('password')) {
    const { password } = this;
    const hashedPassword = await hash(password, SALT_ROUNDS).catch(next);
    this.password = hashedPassword;
  }
  next();
}

export function generateToken(payload: AuthInfo) {
  const token = sign(payload, SECRET, {});
  return token;
}

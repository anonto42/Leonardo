import { Model } from 'mongoose';
import { STATUS, USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  age: number;
  occupation: string;
  gender: string;
  personality: string;
  nationality: string;
  completedTasks: number;
  fmToken: string;
  coin: number;
  password: string;
  image?: string;
  status: STATUS;
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isValidUser(id: string):any;
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;

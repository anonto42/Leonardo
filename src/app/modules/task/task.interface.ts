import { Document, Model, Types } from 'mongoose';

export type ITask = {
  taskName: string;
  category: Types.ObjectId;
  selectDate: Date;
  selectTime: Date;
  watchTime: number;
  createdBy: Types.ObjectId;
  isComplete: boolean;
  isInStrick: boolean;
} & Document;

export type TaskModel = {
  isArray(token: string): any;
} & Model<ITask>;

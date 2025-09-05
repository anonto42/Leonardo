import { Model } from 'mongoose';
import { TCategoryCoinAcction } from '../../../types/category';

export interface ICategory extends Document {
  name: string;
  image?: string;
  action: TCategoryCoinAcction
  coin: number;
}

export type CategoryModel = {
  isArray(token: string): any;
} & Model<ICategory>;

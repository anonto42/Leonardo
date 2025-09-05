import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Category } from './category.model';
import { TCategoryCoinAcction } from '../../../types/category';
import { ICategory } from './category.interface';
import { Types } from 'mongoose';

const allCategories = async (
  {
    page = 1,
    limit = 10,
  }: { 
    page?: number,
    limit?: number
  }
) => {
  const categories = await Category
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  if (!categories) {
    throw new ApiError(
      StatusCodes.NOT_FOUND, 
      'Categories not found'
    );
  }
  return categories;
}

const createCategory = async (
  categoryData: {
  name: string;
  image?: string;
  action: TCategoryCoinAcction;
  coin: number;
}) => {
  const createdCategory = await Category.create(categoryData);
  if (!createdCategory) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,  
      'Failed to create category'
    );
  }
  return createdCategory;
}

const updateCategory = async(
  id: string,
  data: ICategory
) => {
  
  const updateCategory = await Category.findByIdAndUpdate(
    new Types.ObjectId( id ),
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!updateCategory) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Category not found!"
    )
  }

  return updateCategory;
}

const aCategory = async (
  id: string
) => {

  const category = await Category
    .findById( new Types.ObjectId( id ) )
    .lean();
  if (!category) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Catagory not found"
    )
  }

  return category;
}

const DeleteaCategory = async (
  id: string
) => {

  const category = await Category
    .findByIdAndDelete( new Types.ObjectId( id ) )
    .lean();
  if (!category) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Catagory not found"
    )
  }

  return category;
}

export const CategoryService = {
  allCategories,
  createCategory,
  updateCategory,
  aCategory,
  DeleteaCategory
}
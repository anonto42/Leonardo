import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const AllCategoriesController = catchAsync(async (
  req: Request, 
  res: Response
) => {

  const { page, limit }: { page?: number; limit?: number } = req.query;
  const result = await CategoryService.allCategories({ page, limit });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All categories retrieved successfully",
    data: result,
  });
});

const createCategoryController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { ...categoryData } = req.body;
  const image = getSingleFilePath(req.files, "image");
  categoryData.image = image
  const result = await CategoryService.createCategory(categoryData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const updateCategoryController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { ...categoryData } = req.body;
  const image = getSingleFilePath(req.files, "image");
  categoryData.image = image
  
  const result = await CategoryService.updateCategory(categoryData.id,categoryData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Category updated successfully",
    data: result,
  });
});

const getCategoryController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const id = req.params.id;

  const result = await CategoryService.aCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully got a category",
    data: result,
  });
});

const deleteCategoryController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const id = req.params.id;

  const result = await CategoryService.DeleteaCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully deleted a category!",
    data: result,
  });
});

export const CategoryController = { 
  AllCategoriesController,
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  deleteCategoryController
}
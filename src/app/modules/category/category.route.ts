import { Router } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(CategoryValidation.AllTCategoryCoinAcctionZodSchema),
    CategoryController.AllCategoriesController
  )
  .post(
    auth(USER_ROLES.ADMIN),
    fileUploadHandler(),
    validateRequest(CategoryValidation.createCategoryZodSchema),
    CategoryController.createCategoryController
  )
  .patch(
    auth(USER_ROLES.ADMIN),
    fileUploadHandler(),
    validateRequest(CategoryValidation.updateCategoryZodSchema),
    CategoryController.updateCategoryController
  )

router
  .route("/:id")
  .get(
    auth(USER_ROLES.ADMIN),
    validateRequest( CategoryValidation.ACategoryZodSchema ),
    CategoryController.getCategoryController
  )
  .delete(
    auth(USER_ROLES.ADMIN),
    validateRequest( CategoryValidation.ACategoryZodSchema ),
    CategoryController.deleteCategoryController
  )

export const CategoryRoutes = router;

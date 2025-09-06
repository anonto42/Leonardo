import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();


//This will the overview route for admin panel
router
  .route('/')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(AdminValidation.allUsersZodSchema),
    // AdminController.defaultFunction
  );

router
  .route('/users')
  .get(
    auth(USER_ROLES.ADMIN),
    validateRequest(AdminValidation.allUsersZodSchema),
    AdminController.getUsersController
  );

router
  .route('/users/:id')
  .get(
    auth(USER_ROLES.ADMIN),
    validateRequest(AdminValidation.getUserZodSchema),
    AdminController.getUserController
  )
  .delete(
    auth(USER_ROLES.ADMIN),
    validateRequest(AdminValidation.getUserZodSchema),
    AdminController.deleteUserController
  );

router
  .route('/users/:id/status')
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(AdminValidation.updateUserStatusZodSchema),
    AdminController.updateUserStatus
  );

router
  .route('/condition')
  .get(
    auth( USER_ROLES.USER, USER_ROLES.ADMIN ),
    AdminController.getConditonController
  )
  .patch(
    auth( USER_ROLES.ADMIN ),
    validateRequest( AdminValidation.createConditionStatusZodSchema ),
    AdminController.createConditonController
  );

router
  .route('/policy')
  .get(
    auth(USER_ROLES.USER, USER_ROLES.ADMIN),
    AdminController.getPolicyontroller
  )
  .patch(
    auth( USER_ROLES.ADMIN ),
    validateRequest( AdminValidation.createConditionStatusZodSchema ),
    AdminController.createPolicyController
  );

export const AdminRoutes = router;

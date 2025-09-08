import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';

const router = express.Router();

router
  .route("/")
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(TaskValidation.createTaskZodSchema),
    TaskController.createTask
  );

router
  .route("/:id")
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(TaskValidation.deleteTaskZod),
    TaskController.deleteTaskController
  );

router
  .route("/category")
  .get(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
    validateRequest( TaskValidation.getTaskZodSchema ),
    TaskController.allCategoryes
  )

router
  .route("/history")
  .get(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest( TaskValidation.getTaskZodSchema ),
    TaskController.getHistoryOfTasks 
  )

router
  .route("/strikes")
  .get(
    auth(USER_ROLES.ADMIN,USER_ROLES.USER),
    validateRequest( TaskValidation.getTaskZodSchema),
    TaskController.allStrikesTaskController
  )

export const TaskRoutes = router;

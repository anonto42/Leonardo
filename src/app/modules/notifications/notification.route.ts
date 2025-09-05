import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { NotificationValidation } from "./notification.validation";
import { NotificationController } from "./notification.controller";

const router = Router();

router 
    .route("/")
    .get(
        auth(USER_ROLES.USER, USER_ROLES.ADMIN),
        validateRequest( NotificationValidation.getNotificationValidation ),
        NotificationController.getNotifications
    )
    .patch(
        auth(USER_ROLES.USER,USER_ROLES.ADMIN),
        validateRequest(NotificationValidation.updateStatusNotificationValidation),
        NotificationController.updateNotificationStatus
    )

export const NotificationRoutes = router
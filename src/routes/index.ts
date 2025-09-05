import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { TaskRoutes } from '../app/modules/task/task.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { NotificationRoutes } from '../app/modules/notifications/notification.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/task',
    route: TaskRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { courseRoutes } from './modules/courses/courses.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { enrollmentRoutes } from './modules/enrollments/enrollments.routes';
import { lessonRoutes } from './modules/lessons/lessons.routes';

export const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/courses', courseRoutes);
apiRoutes.use('/', enrollmentRoutes);
apiRoutes.use('/lessons', lessonRoutes);
apiRoutes.use('/dashboard', dashboardRoutes);

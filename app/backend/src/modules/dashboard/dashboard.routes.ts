import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user!.role === Role.ADMIN) {
      const [users, courses, enrollments, completedEnrollments] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.enrollment.count({ where: { status: 'COMPLETED' } })
      ]);

      return res.json({
        stats: [
          { label: 'Users', value: users },
          { label: 'Courses', value: courses },
          { label: 'Enrollments', value: enrollments },
          { label: 'Completed', value: completedEnrollments }
        ]
      });
    }

    if (req.user!.role === Role.INSTRUCTOR) {
      const [myCourses, myStudents, lessons] = await Promise.all([
        prisma.course.count({ where: { authorId: req.user!.id } }),
        prisma.enrollment.count({ where: { course: { authorId: req.user!.id } } }),
        prisma.lesson.count({ where: { course: { authorId: req.user!.id } } })
      ]);

      return res.json({
        stats: [
          { label: 'My Courses', value: myCourses },
          { label: 'Students', value: myStudents },
          { label: 'Lessons', value: lessons }
        ]
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: { course: { include: { lessons: true } } }
    });

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((item) => item.status === 'COMPLETED').length;
    const totalLessons = enrollments.reduce((sum, item) => sum + item.course.lessons.length, 0);
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: req.user!.id, completed: true }
    });

    return res.json({
      stats: [
        { label: 'My Courses', value: totalCourses },
        { label: 'Completed Courses', value: completedCourses },
        { label: 'Lessons Finished', value: completedLessons },
        { label: 'Total Lessons', value: totalLessons }
      ]
    });
  } catch (error) {
    return next(error);
  }
});

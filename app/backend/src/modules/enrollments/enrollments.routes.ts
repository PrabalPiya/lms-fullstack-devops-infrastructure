import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const enrollmentRoutes = Router();

enrollmentRoutes.post('/courses/:courseId/enroll', requireAuth, async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
      select: { id: true, published: true }
    });

    if (!course || !course.published) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: req.user!.id,
          courseId: course.id
        }
      },
      update: { status: 'ACTIVE' },
      create: {
        userId: req.user!.id,
        courseId: course.id
      }
    });

    return res.status(201).json({ enrollment });
  } catch (error) {
    return next(error);
  }
});

enrollmentRoutes.get('/my/enrollments', requireAuth, async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: {
        course: {
          include: {
            author: { select: { id: true, name: true } },
            lessons: { select: { id: true } }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    const result = await Promise.all(
      enrollments.map(async (enrollment) => {
        const lessonIds = enrollment.course.lessons.map((lesson) => lesson.id);
        const completed = await prisma.lessonProgress.count({
          where: {
            userId: req.user!.id,
            lessonId: { in: lessonIds },
            completed: true
          }
        });

        return {
          id: enrollment.id,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
          course: {
            ...enrollment.course,
            lessonCount: lessonIds.length,
            completedLessons: completed,
            progressPercent: lessonIds.length === 0 ? 0 : Math.round((completed / lessonIds.length) * 100),
            lessons: undefined
          }
        };
      })
    );

    return res.json({ enrollments: result });
  } catch (error) {
    return next(error);
  }
});

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const lessonRoutes = Router();

const progressSchema = z.object({
  completed: z.boolean()
});

lessonRoutes.patch('/:lessonId/progress', requireAuth, async (req, res, next) => {
  try {
    const body = progressSchema.parse(req.body);

    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.lessonId },
      include: { course: true }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user!.id,
          courseId: lesson.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in the course before tracking progress' });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user!.id,
          lessonId: lesson.id
        }
      },
      update: {
        completed: body.completed,
        completedAt: body.completed ? new Date() : null
      },
      create: {
        userId: req.user!.id,
        lessonId: lesson.id,
        completed: body.completed,
        completedAt: body.completed ? new Date() : null
      }
    });

    const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: req.user!.id,
        lesson: { courseId: lesson.courseId },
        completed: true
      }
    });

    if (totalLessons > 0 && completedLessons === totalLessons) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: req.user!.id,
            courseId: lesson.courseId
          }
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });
    }

    return res.json({
      progress,
      courseProgress: {
        totalLessons,
        completedLessons,
        progressPercent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
      }
    });
  } catch (error) {
    return next(error);
  }
});

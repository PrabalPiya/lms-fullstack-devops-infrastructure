import { Router } from 'express';
import { CourseLevel, Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { allowRoles, requireAuth } from '../../middleware/auth';
import { createSlug } from '../../utils/slug';

export const courseRoutes = Router();

const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  level: z.nativeEnum(CourseLevel).default(CourseLevel.BEGINNER),
  imageUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(true),
  lessons: z
    .array(
      z.object({
        title: z.string().min(3),
        content: z.string().min(10),
        videoUrl: z.string().url().optional().or(z.literal(''))
      })
    )
    .min(1)
});

courseRoutes.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();

    const courses = await prisma.course.findMany({
      where: {
        published: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {}),
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {})
      },
      include: {
        author: { select: { id: true, name: true } },
        lessons: { select: { id: true } },
        enrollments: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      courses: courses.map((course) => ({
        ...course,
        lessonCount: course.lessons.length,
        enrollmentCount: course.enrollments.length,
        lessons: undefined,
        enrollments: undefined
      }))
    });
  } catch (error) {
    return next(error);
  }
});

courseRoutes.get('/:courseId', requireAuth, async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        author: { select: { id: true, name: true, email: true } },
        lessons: { orderBy: { order: 'asc' } },
        enrollments: {
          where: { userId: req.user!.id },
          select: { id: true, status: true, enrolledAt: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lessonIds = course.lessons.map((lesson) => lesson.id);
    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user!.id,
        lessonId: { in: lessonIds },
        completed: true
      },
      select: { lessonId: true }
    });

    return res.json({
      course: {
        ...course,
        isEnrolled: course.enrollments.length > 0,
        enrollment: course.enrollments[0] || null,
        completedLessonIds: progress.map((item) => item.lessonId),
        enrollments: undefined
      }
    });
  } catch (error) {
    return next(error);
  }
});

courseRoutes.post('/', requireAuth, allowRoles(Role.ADMIN, Role.INSTRUCTOR), async (req, res, next) => {
  try {
    const body = createCourseSchema.parse(req.body);
    const baseSlug = createSlug(body.title);
    const existing = await prisma.course.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const course = await prisma.course.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        category: body.category,
        level: body.level,
        imageUrl: body.imageUrl || null,
        published: body.published,
        authorId: req.user!.id,
        lessons: {
          create: body.lessons.map((lesson, index) => ({
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl || null,
            order: index + 1
          }))
        }
      },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        author: { select: { id: true, name: true } }
      }
    });

    return res.status(201).json({ course });
  } catch (error) {
    return next(error);
  }
});

courseRoutes.patch('/:courseId', requireAuth, allowRoles(Role.ADMIN, Role.INSTRUCTOR), async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3).optional(),
      description: z.string().min(10).optional(),
      category: z.string().min(2).optional(),
      level: z.nativeEnum(CourseLevel).optional(),
      imageUrl: z.string().url().optional().or(z.literal('')),
      published: z.boolean().optional()
    });

    const body = schema.parse(req.body);
    const existingCourse = await prisma.course.findUnique({ where: { id: req.params.courseId } });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user!.role === Role.INSTRUCTOR && existingCourse.authorId !== req.user!.id) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }

    const course = await prisma.course.update({
      where: { id: req.params.courseId },
      data: {
        ...body,
        imageUrl: body.imageUrl === '' ? null : body.imageUrl
      }
    });

    return res.json({ course });
  } catch (error) {
    return next(error);
  }
});

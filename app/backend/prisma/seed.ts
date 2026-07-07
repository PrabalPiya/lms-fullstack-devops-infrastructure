import { CourseLevel, Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function password(value: string) {
  return bcrypt.hash(value, 10);
}

async function main() {
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@learnhub.local',
      passwordHash: await password('Admin@12345'),
      role: Role.ADMIN
    }
  });

  const instructor = await prisma.user.create({
    data: {
      name: 'Anita Instructor',
      email: 'instructor@learnhub.local',
      passwordHash: await password('Instructor@12345'),
      role: Role.INSTRUCTOR
    }
  });

  const student = await prisma.user.create({
    data: {
      name: 'Prabal Student',
      email: 'student@learnhub.local',
      passwordHash: await password('Student@12345'),
      role: Role.STUDENT
    }
  });

  const devopsCourse = await prisma.course.create({
    data: {
      title: 'DevOps Fundamentals',
      slug: 'devops-fundamentals',
      description: 'Learn the core ideas of DevOps, CI/CD, containers, infrastructure automation, and production monitoring.',
      category: 'DevOps',
      level: CourseLevel.BEGINNER,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
      published: true,
      authorId: instructor.id,
      lessons: {
        create: [
          {
            title: 'What is DevOps?',
            content: 'DevOps is a way of building and operating software where development and operations work together. The goal is to deliver reliable software faster using automation, feedback, and continuous improvement.',
            order: 1
          },
          {
            title: 'CI/CD Pipeline Basics',
            content: 'A CI/CD pipeline automatically builds, tests, and deploys code. It helps teams reduce manual errors and release changes safely.',
            order: 2
          },
          {
            title: 'Containers and Images',
            content: 'Containers package an application with everything it needs to run. Docker images are used to build repeatable application environments.',
            order: 3
          }
        ]
      }
    }
  });

  const reactCourse = await prisma.course.create({
    data: {
      title: 'Modern React with TypeScript',
      slug: 'modern-react-with-typescript',
      description: 'Build professional frontend applications using React, TypeScript, reusable components, hooks, routing, and API integration.',
      category: 'Frontend',
      level: CourseLevel.INTERMEDIATE,
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
      published: true,
      authorId: instructor.id,
      lessons: {
        create: [
          {
            title: 'React Project Structure',
            content: 'A clean React project separates pages, components, API utilities, hooks, and shared types. This makes the app easier to maintain as it grows.',
            order: 1
          },
          {
            title: 'Working with Forms',
            content: 'Forms collect user input and send data to APIs. Controlled components make form state predictable in React.',
            order: 2
          },
          {
            title: 'API Calls with Axios',
            content: 'Axios is commonly used to call backend APIs. It can also attach authentication tokens to each request using interceptors.',
            order: 3
          }
        ]
      }
    }
  });

  const apiCourse = await prisma.course.create({
    data: {
      title: 'Backend APIs with Node.js',
      slug: 'backend-apis-with-nodejs',
      description: 'Learn how to build REST APIs using Node.js, Express, TypeScript, validation, authentication, and database access.',
      category: 'Backend',
      level: CourseLevel.BEGINNER,
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
      published: true,
      authorId: admin.id,
      lessons: {
        create: [
          {
            title: 'Express Routing',
            content: 'Express routes receive HTTP requests and return responses. Routes should be organized by feature for cleaner backend architecture.',
            order: 1
          },
          {
            title: 'Authentication with JWT',
            content: 'JWT authentication sends a signed token to the frontend after login. The frontend includes the token when making protected requests.',
            order: 2
          },
          {
            title: 'Database Access with Prisma',
            content: 'Prisma provides a type-safe way to interact with a database. It uses a schema file to define models and relationships.',
            order: 3
          }
        ]
      }
    }
  });

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: devopsCourse.id
    }
  });

  const firstLesson = await prisma.lesson.findFirstOrThrow({
    where: { courseId: devopsCourse.id, order: 1 }
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: firstLesson.id,
      completed: true,
      completedAt: new Date()
    }
  });

  console.log('Seed completed');
  console.log({ admin: admin.email, instructor: instructor.email, student: student.email, enrollment: enrollment.id, extraCourse: reactCourse.id, apiCourse: apiCourse.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

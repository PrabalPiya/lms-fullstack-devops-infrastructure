export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  order: number;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: CourseLevel;
  imageUrl?: string | null;
  published: boolean;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  lessonCount?: number;
  enrollmentCount?: number;
  lessons?: Lesson[];
  isEnrolled?: boolean;
  completedLessonIds?: string[];
  progressPercent?: number;
  completedLessons?: number;
};

export type Enrollment = {
  id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
  course: Course;
};

export type DashboardStat = {
  label: string;
  value: number;
};

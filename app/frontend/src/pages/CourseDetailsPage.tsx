import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { Course } from '../types';

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCourse() {
    try {
      setLoading(true);
      const response = await api.get<{ course: Course }>(`/courses/${courseId}`);
      setCourse(response.data.course);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const progress = useMemo(() => {
    if (!course?.lessons?.length) return 0;
    const completed = course.completedLessonIds?.length || 0;
    return Math.round((completed / course.lessons.length) * 100);
  }, [course]);

  async function enroll() {
    try {
      setSaving(true);
      await api.post(`/courses/${courseId}/enroll`);
      await loadCourse();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleLesson(lessonId: string, completed: boolean) {
    try {
      await api.patch(`/lessons/${lessonId}/progress`, { completed });
      await loadCourse();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) {
    return <div className="panel">Loading course...</div>;
  }

  if (!course) {
    return <div className="errorBox">Course not found</div>;
  }

  return (
    <div className="pageStack">
      {error && <div className="errorBox">{error}</div>}

      <section className="courseHero">
        <div>
          <span className="eyebrow">{course.category} · {course.level}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="courseHeroMeta">
            <span>Instructor: {course.author.name}</span>
            <span>{course.lessons?.length || 0} lessons</span>
            <span>{progress}% completed</span>
          </div>
        </div>
        <div className="heroAction">
          {!course.isEnrolled ? (
            <button className="primaryButton" onClick={enroll} disabled={saving}>
              {saving ? 'Enrolling...' : 'Enroll Now'}
            </button>
          ) : (
            <div className="progressBox">
              <strong>{progress}%</strong>
              <span>Course progress</span>
              <div className="progressTrack"><div style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Lessons</h2>
        <div className="lessonList">
          {course.lessons?.map((lesson) => {
            const completed = course.completedLessonIds?.includes(lesson.id) || false;
            return (
              <article key={lesson.id} className="lessonItem">
                <div>
                  <span className="lessonNumber">Lesson {lesson.order}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.content}</p>
                </div>
                <label className="checkLabel">
                  <input
                    type="checkbox"
                    checked={completed}
                    disabled={!course.isEnrolled}
                    onChange={(event) => toggleLesson(lesson.id, event.target.checked)}
                  />
                  Completed
                </label>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { CourseLevel } from '../types';

type LessonInput = {
  title: string;
  content: string;
  videoUrl: string;
};

export function CreateCoursePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: 'DevOps',
    level: 'BEGINNER' as CourseLevel,
    imageUrl: '',
    published: true
  });
  const [lessons, setLessons] = useState<LessonInput[]>([
    { title: '', content: '', videoUrl: '' }
  ]);

  function updateLesson(index: number, field: keyof LessonInput, value: string) {
    setLessons((current) =>
      current.map((lesson, itemIndex) => (itemIndex === index ? { ...lesson, [field]: value } : lesson))
    );
  }

  function addLesson() {
    setLessons((current) => [...current, { title: '', content: '', videoUrl: '' }]);
  }

  function removeLesson(index: number) {
    setLessons((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/courses', {
        ...course,
        lessons
      });
      navigate(`/courses/${response.data.course.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pageStack">
      <header className="pageHeader">
        <span className="eyebrow">Instructor</span>
        <h1>Create course</h1>
        <p>Create a course with lessons. This page is only for instructors and admins.</p>
      </header>

      <form className="panel formStack" onSubmit={handleSubmit}>
        {error && <div className="errorBox">{error}</div>}

        <div className="formGrid twoFields">
          <label>
            Course title
            <input value={course.title} onChange={(event) => setCourse({ ...course, title: event.target.value })} required />
          </label>

          <label>
            Category
            <input value={course.category} onChange={(event) => setCourse({ ...course, category: event.target.value })} required />
          </label>
        </div>

        <label>
          Description
          <textarea value={course.description} onChange={(event) => setCourse({ ...course, description: event.target.value })} required rows={4} />
        </label>

        <div className="formGrid twoFields">
          <label>
            Level
            <select value={course.level} onChange={(event) => setCourse({ ...course, level: event.target.value as CourseLevel })}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </label>

          <label>
            Image URL
            <input value={course.imageUrl} onChange={(event) => setCourse({ ...course, imageUrl: event.target.value })} placeholder="Optional" />
          </label>
        </div>

        <div className="sectionTitle">
          <h2>Lessons</h2>
          <button type="button" className="ghostButton" onClick={addLesson}>Add lesson</button>
        </div>

        {lessons.map((lesson, index) => (
          <div className="lessonEditor" key={index}>
            <div className="sectionTitle">
              <strong>Lesson {index + 1}</strong>
              {lessons.length > 1 && (
                <button type="button" className="dangerButton" onClick={() => removeLesson(index)}>Remove</button>
              )}
            </div>

            <label>
              Lesson title
              <input value={lesson.title} onChange={(event) => updateLesson(index, 'title', event.target.value)} required />
            </label>

            <label>
              Lesson content
              <textarea value={lesson.content} onChange={(event) => updateLesson(index, 'content', event.target.value)} required rows={3} />
            </label>

            <label>
              Video URL
              <input value={lesson.videoUrl} onChange={(event) => updateLesson(index, 'videoUrl', event.target.value)} placeholder="Optional" />
            </label>
          </div>
        ))}

        <button className="primaryButton" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}

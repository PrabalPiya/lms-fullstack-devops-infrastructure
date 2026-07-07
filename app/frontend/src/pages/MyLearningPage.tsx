import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { Enrollment } from '../types';

export function MyLearningPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLearning() {
      try {
        const response = await api.get<{ enrollments: Enrollment[] }>('/my/enrollments');
        setEnrollments(response.data.enrollments);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadLearning();
  }, []);

  return (
    <div className="pageStack">
      <header className="pageHeader">
        <span className="eyebrow">My Learning</span>
        <h1>Enrolled courses</h1>
        <p>Continue your courses and track your completion progress.</p>
      </header>

      {error && <div className="errorBox">{error}</div>}
      {loading && <div className="panel">Loading your courses...</div>}

      {!loading && enrollments.length === 0 && (
        <div className="panel emptyState">
          <h2>No enrollments yet</h2>
          <p>Go to courses and enroll in your first course.</p>
          <Link className="primaryButton linkButton" to="/courses">Browse Courses</Link>
        </div>
      )}

      <section className="learningList">
        {enrollments.map((item) => (
          <article key={item.id} className="learningCard">
            <div>
              <span className="eyebrow">{item.status}</span>
              <h3>{item.course.title}</h3>
              <p>{item.course.description}</p>
              <div className="progressTrack"><div style={{ width: `${item.course.progressPercent || 0}%` }} /></div>
              <span>{item.course.completedLessons || 0} of {item.course.lessonCount || 0} lessons completed</span>
            </div>
            <Link to={`/courses/${item.course.id}`}>Continue</Link>
          </article>
        ))}
      </section>
    </div>
  );
}

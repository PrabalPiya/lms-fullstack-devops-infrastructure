import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../api/client';
import { CourseCard } from '../components/CourseCard';
import { Course } from '../types';

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadCourses(query = '') {
    try {
      setLoading(true);
      const response = await api.get<{ courses: Course[] }>('/courses', {
        params: query ? { search: query } : undefined
      });
      setCourses(response.data.courses);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="pageStack">
      <header className="pageHeader rowHeader">
        <div>
          <span className="eyebrow">Courses</span>
          <h1>Explore courses</h1>
          <p>Browse available courses and enroll in the ones you want to learn.</p>
        </div>
        <form className="searchBox" onSubmit={(event) => { event.preventDefault(); loadCourses(search); }}>
          <input placeholder="Search courses..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <button className="primaryButton">Search</button>
        </form>
      </header>

      {error && <div className="errorBox">{error}</div>}
      {loading && <div className="panel">Loading courses...</div>}

      {!loading && (
        <section className="courseGrid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      )}
    </div>
  );
}

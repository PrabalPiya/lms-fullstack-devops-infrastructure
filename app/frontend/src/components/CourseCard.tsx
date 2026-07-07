import { Link } from 'react-router-dom';
import { Course } from '../types';

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="courseCard">
      <div className="courseImage" style={{ backgroundImage: `url(${course.imageUrl || ''})` }}>
        {!course.imageUrl && <span>{course.category}</span>}
      </div>
      <div className="courseBody">
        <div className="courseMeta">
          <span>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="courseFooter">
          <span>{course.lessonCount ?? course.lessons?.length ?? 0} lessons</span>
          <Link to={`/courses/${course.id}`}>View Course</Link>
        </div>
      </div>
    </article>
  );
}

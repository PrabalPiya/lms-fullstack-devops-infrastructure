import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">LH</div>
          <div>
            <strong>LearnHub</strong>
            <span>LMS Platform</span>
          </div>
        </div>

        <nav className="navMenu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/my-learning">My Learning</NavLink>
          {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
            <NavLink to="/courses/new">Create Course</NavLink>
          )}
        </nav>

        <div className="sidebarFooter">
          <div className="userCard">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="ghostButton" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  );
}

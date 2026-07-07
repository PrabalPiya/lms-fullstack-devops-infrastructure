import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CreateCoursePage } from './pages/CreateCoursePage';
import { MyLearningPage } from './pages/MyLearningPage';

function RoleGuard({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route
          path="/courses/new"
          element={
            <RoleGuard>
              <CreateCoursePage />
            </RoleGuard>
          }
        />
        <Route path="/my-learning" element={<MyLearningPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

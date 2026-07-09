import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../api/client';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../auth/AuthContext';
import { DashboardStat } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get<{ stats: DashboardStat[] }>('/dashboard');
        setStats(response.data.stats);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="pageStack">
      <header className="pageHeader">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Hello, {user?.name}</h1>
          <p>Track your LMS activity from one simple dashboard.</p>
        </div>
      </header>

      {error && <div className="errorBox">{error}</div>}

      <section className="statsGrid">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="panel">
        <h2>What this app includes</h2>
        <div className="featureGrid">
          <div>
            <strong>Role based access</strong>
            <p>Admin, instructor, and student roles with protected routes.</p>
          </div>
          <div>
            <strong>Course management</strong>
            <p>Instructors can create courses with lessons.</p>
          </div>
          <div>
            <strong>Enrollment flow</strong>
            <p>Students can enroll and track course progress.</p>
          </div>
          <div>
            <strong>DevOps-ready structure</strong>
            <p>Clean frontend/backend separation for your deployment practice.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

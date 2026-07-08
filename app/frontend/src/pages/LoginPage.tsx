import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@learnhub.local');
  const [password, setPassword] = useState('Student@12345');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="authPage">
      <section className="authCard">
        <div className="authIntro">
          <div className="brandMark">LH</div>
          <h1>Welcome back</h1>
          <p>Log in to manage courses, lessons, enrollments, and learning progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="formStack">
          {error && <div className="errorBox">{error}</div>}

          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>

          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>

          <button className="primaryButton" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="authSwitch">No account? <Link to="/register">Create one</Link></p>

      </section>
    </div>
  );
}

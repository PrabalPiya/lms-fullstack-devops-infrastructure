import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Role } from '../types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as Role
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
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
          <h1>Create account</h1>
          <p>Join as a student or instructor and start using the LMS.</p>
        </div>

        <form onSubmit={handleSubmit} className="formStack">
          {error && <div className="errorBox">{error}</div>}

          <label>
            Full name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>

          <label>
            Email
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
          </label>

          <label>
            Password
            <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required minLength={8} />
          </label>

          <label>
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}>
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </label>

          <button className="primaryButton" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="authSwitch">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </div>
  );
}

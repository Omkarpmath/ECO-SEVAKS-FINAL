import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = async (role) => {
    let demoEmail = '';
    if (role === 'user') demoEmail = 'aisha@example.com';
    if (role === 'organizer') demoEmail = 'rohan@example.com';
    if (role === 'admin') demoEmail = 'priya@example.com';

    setEmail(demoEmail);
    setPassword('password123');

    // Call login directly after setting state
    await login(demoEmail, 'password123');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
          Login
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
      <p className="text-center mt-4">
        Don't have an account?
        <Link to="/register" className="text-primary hover:underline ml-1">Register here</Link>
      </p>
      <hr className="my-4" />
      <p className="text-center text-sm text-gray-500">Demo Logins (password: password123)</p>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <button className="flex-1 text-sm bg-primary-light text-primary-text p-2 rounded hover:bg-opacity-80" onClick={() => handleDemoLogin('user')}>Login as Aisha (User)</button>
        <button className="flex-1 text-sm bg-primary-light text-primary-text p-2 rounded hover:bg-opacity-80" onClick={() => handleDemoLogin('admin')}>As Priya (Admin)</button>
      </div>
    </div>
  );
}
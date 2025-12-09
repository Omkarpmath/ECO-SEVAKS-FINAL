/**
 * Login Page Component
 * ====================
 * Premium login page with glassmorphism design
 * Features:
 * - Glassmorphism card with backdrop blur
 * - Floating label inputs with animations
 * - Animated error messages with shake effect
 * - Loading state on submit button
 * - Background with animated gradient
 * - Demo login buttons with hover effects
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Leaf, Shield, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: 'admin@ecosevaks.com', password: 'Admin@123' },
    };

    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setIsLoading(true);

    try {
      await login(creds.email, creds.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in-down">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to continue your eco journey</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
              error={error && !email ? 'Email is required' : ''}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
              error={error && !password ? 'Password is required' : ''}
            />

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              leftIcon={<LogIn className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Logins */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-500">
                Or try a demo account
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="
                w-full group flex items-center justify-center gap-2
                px-4 py-3
                bg-white hover:bg-primary-50
                border-2 border-gray-200 hover:border-primary-300
                rounded-xl
                text-gray-700 font-medium
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Shield className="w-4 h-4 text-primary-600" />
              <span>Login as Admin</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            Quick admin login (admin@ecosevaks.com)
          </p>
        </div>
      </div>
    </div>
  );
}
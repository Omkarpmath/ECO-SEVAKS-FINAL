/**
 * Register Page Component
 * =======================
 * Premium registration page with role selection
 * Features:
 * - Glassmorphism card with backdrop blur
 * - Floating label inputs with animations
 * - Role selection cards with icons
 * - Success animation on registration
 * - Responsive layout
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Leaf,
  Users,
  Shield,
  Check
} from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

// ============================================
// PASSWORD STRENGTH INDICATOR (Commented Out)
// Uncomment the code below to enable password strength validation
// ============================================
// const PasswordStrength = ({ password }) => {
//   const getStrength = (pass) => {
//     let score = 0;
//     if (pass.length >= 8) score++;
//     if (/[A-Z]/.test(pass)) score++;
//     if (/[a-z]/.test(pass)) score++;
//     if (/[0-9]/.test(pass)) score++;
//     if (/[^A-Za-z0-9]/.test(pass)) score++;
//     return score;
//   };
//
//   const strength = getStrength(password);
//   const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
//   const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];
//
//   if (!password) return null;
//
//   return (
//     <div className="mt-2 space-y-2 animate-fade-in">
//       <div className="flex gap-1">
//         {[...Array(5)].map((_, i) => (
//           <div
//             key={i}
//             className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-gray-200'}`}
//           />
//         ))}
//       </div>
//       <p className={`text-xs font-medium ${strength < 3 ? 'text-red-600' : 'text-emerald-600'}`}>
//         Password strength: {labels[strength - 1] || 'Too weak'}
//       </p>
//     </div>
//   );
// };

// ============================================
// ROLE SELECTION CARD
// ============================================
const RoleCard = ({ role, icon: Icon, title, description, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      relative p-4
      border-2 rounded-xl
      text-left
      transition-all duration-300
      ${isSelected
        ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
      }
    `}
  >
    {/* Selected indicator */}
    {isSelected && (
      <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
    )}

    <div className={`
      inline-flex p-2 rounded-lg mb-2
      ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}
      transition-colors duration-300
    `}>
      <Icon className="w-5 h-5" />
    </div>

    <h3 className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </button>
);

// ============================================
// MAIN REGISTER COMPONENT
// ============================================
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }



    setIsLoading(true);
    try {
      await register(name, email, password, role);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: 'user',
      icon: User,
      title: 'Volunteer',
      description: 'Join and participate in events',
    },
    {
      value: 'organizer',
      icon: Users,
      title: 'Organizer',
      description: 'Create and manage events',
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in-down">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Eco Sevaks</h1>
          <p className="text-gray-600">Create your account and start making a difference</p>
        </div>

        {/* Register Card */}
        <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <RoleCard
                    key={r.value}
                    {...r}
                    isSelected={role === r.value}
                    onClick={() => setRole(r.value)}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              leftIcon={<UserPlus className="w-5 h-5" />}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}